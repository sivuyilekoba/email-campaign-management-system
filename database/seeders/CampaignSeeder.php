<?php

namespace Database\Seeders;

use App\CampaignStatus;
use App\EmailJobStatus;
use App\Jobs\ProcessEmailJob;
use App\Models\Campaign;
use App\Models\EmailJob;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pendingEmailJobIds = [];

        DB::transaction(function () use (&$pendingEmailJobIds): void {
            foreach (range(1, 20) as $campaignNumber) {
                $campaignName = sprintf('Sample Campaign %02d', $campaignNumber);

                if (Campaign::query()->where('name', $campaignName)->exists()) {
                    continue;
                }

                $campaignStatus = match ($campaignNumber % 3) {
                    1 => CampaignStatus::Queued,
                    2 => CampaignStatus::Processing,
                    default => CampaignStatus::Done,
                };
                $recipientCount = fake()->numberBetween(2, 5);

                $campaign = Campaign::factory()->create([
                    'name' => $campaignName,
                    'status' => $campaignStatus,
                    'recipient_count' => $recipientCount,
                ]);

                foreach (range(1, $recipientCount) as $recipientNumber) {
                    $emailJobStatus = match ($campaignStatus) {
                        CampaignStatus::Queued => EmailJobStatus::Pending,
                        CampaignStatus::Processing => $recipientNumber === 1
                            ? EmailJobStatus::Sent
                            : EmailJobStatus::Pending,
                        CampaignStatus::Done => $recipientNumber === 1
                            ? EmailJobStatus::Sent
                            : fake()->randomElement([EmailJobStatus::Sent, EmailJobStatus::Failed]),
                    };

                    $emailJob = EmailJob::factory()
                        ->for($campaign)
                        ->create(['status' => $emailJobStatus]);

                    if ($emailJobStatus === EmailJobStatus::Pending) {
                        $pendingEmailJobIds[] = $emailJob->id;
                    }
                }
            }
        });

        foreach ($pendingEmailJobIds as $emailJobId) {
            ProcessEmailJob::dispatch($emailJobId)->afterCommit();
        }
    }
}
