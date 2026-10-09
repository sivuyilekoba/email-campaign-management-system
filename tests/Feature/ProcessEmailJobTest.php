<?php

namespace Tests\Feature;

use App\CampaignStatus;
use App\EmailJobStatus;
use App\Jobs\ProcessEmailJob;
use App\Models\Campaign;
use App\Models\EmailJob;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class ProcessEmailJobTest extends TestCase
{
    use DatabaseMigrations;

    public function test_processing_a_pending_email_job_marks_it_sent_and_completes_the_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $emailJob = EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);

        ProcessEmailJob::dispatch($emailJob->id);

        $this->assertDatabaseHas('email_jobs', [
            'id' => $emailJob->id,
            'status' => EmailJobStatus::Sent->value,
        ]);
        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'status' => CampaignStatus::Done->value,
        ]);
    }

    public function test_processing_keeps_campaign_processing_while_other_emails_are_pending(): void
    {
        $campaign = Campaign::factory()->create(['recipient_count' => 2]);
        $firstEmailJob = EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);
        EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);

        ProcessEmailJob::dispatch($firstEmailJob->id);

        $this->assertDatabaseHas('email_jobs', [
            'id' => $firstEmailJob->id,
            'status' => EmailJobStatus::Sent->value,
        ]);
        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'status' => CampaignStatus::Processing->value,
        ]);
    }

    public function test_campaign_reaches_done_once_the_last_pending_email_is_processed(): void
    {
        $campaign = Campaign::factory()->create(['recipient_count' => 2]);
        $firstEmailJob = EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);
        $secondEmailJob = EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);

        ProcessEmailJob::dispatch($firstEmailJob->id);
        ProcessEmailJob::dispatch($secondEmailJob->id);

        $this->assertDatabaseHas('email_jobs', [
            'id' => $firstEmailJob->id,
            'status' => EmailJobStatus::Sent->value,
        ]);
        $this->assertDatabaseHas('email_jobs', [
            'id' => $secondEmailJob->id,
            'status' => EmailJobStatus::Sent->value,
        ]);
        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'status' => CampaignStatus::Done->value,
        ]);
    }

    public function test_failed_job_marks_email_failed_and_keeps_campaign_processing_when_others_pending(): void
    {
        $campaign = Campaign::factory()->create(['recipient_count' => 2]);
        $failingEmailJob = EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);
        EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);

        (new ProcessEmailJob($failingEmailJob->id))->failed(new \RuntimeException('Simulated send failure'));

        $this->assertDatabaseHas('email_jobs', [
            'id' => $failingEmailJob->id,
            'status' => EmailJobStatus::Failed->value,
        ]);
        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'status' => CampaignStatus::Processing->value,
        ]);
    }

    public function test_failed_job_marks_campaign_done_when_no_pending_emails_remain(): void
    {
        $campaign = Campaign::factory()->create(['recipient_count' => 1]);
        $emailJob = EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Pending]);

        (new ProcessEmailJob($emailJob->id))->failed(new \RuntimeException('Simulated send failure'));

        $this->assertDatabaseHas('email_jobs', [
            'id' => $emailJob->id,
            'status' => EmailJobStatus::Failed->value,
        ]);
        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'status' => CampaignStatus::Done->value,
        ]);
    }

    public function test_job_skips_an_email_that_is_not_pending(): void
    {
        $campaign = Campaign::factory()->create();
        $emailJob = EmailJob::factory()->for($campaign)->create(['status' => EmailJobStatus::Sent]);

        ProcessEmailJob::dispatch($emailJob->id);

        $this->assertDatabaseHas('email_jobs', [
            'id' => $emailJob->id,
            'status' => EmailJobStatus::Sent->value,
        ]);
        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'status' => CampaignStatus::Queued->value,
        ]);
    }

    public function test_job_does_nothing_when_the_email_record_is_missing(): void
    {
        $campaign = Campaign::factory()->create();

        ProcessEmailJob::dispatch(999999);

        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'status' => CampaignStatus::Queued->value,
        ]);
    }
}
