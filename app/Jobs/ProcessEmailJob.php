<?php

namespace App\Jobs;

use App\CampaignStatus;
use App\EmailJobStatus;
use App\Models\EmailJob as EmailJobRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [5, 15];

    public function __construct(public int $emailJobId) {}

    public function handle(): void
    {
        $emailJob = EmailJobRecord::query()->with('campaign')->find($this->emailJobId);

        if ($emailJob === null || $emailJob->status !== EmailJobStatus::Pending) {
            return;
        }

        $emailJob->campaign->update(['status' => CampaignStatus::Processing]);

        Log::info('Processing campaign email', [
            'campaign_id' => $emailJob->campaign_id,
            'email_job_id' => $emailJob->id,
            'recipient_email' => $emailJob->recipient_email,
        ]);

        // The assessment requires a simulated send; no external mail provider is configured.
        Log::info('Email sent successfully', [
            'campaign_id' => $emailJob->campaign_id,
            'email_job_id' => $emailJob->id,
        ]);

        $emailJob->update(['status' => EmailJobStatus::Sent]);
        $emailJob->campaign->refreshProcessingStatus();
    }

    public function failed(?Throwable $exception): void
    {
        $emailJob = EmailJobRecord::query()->with('campaign')->find($this->emailJobId);

        if ($emailJob === null) {
            return;
        }

        $emailJob->update(['status' => EmailJobStatus::Failed]);
        $emailJob->campaign->refreshProcessingStatus();

        Log::error('Campaign email processing failed', [
            'campaign_id' => $emailJob->campaign_id,
            'email_job_id' => $emailJob->id,
            'recipient_email' => $emailJob->recipient_email,
            'exception' => $exception,
        ]);
    }
}
