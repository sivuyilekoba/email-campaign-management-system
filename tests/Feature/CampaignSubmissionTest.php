<?php

namespace Tests\Feature;

use App\Jobs\ProcessEmailJob;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class CampaignSubmissionTest extends TestCase
{
    use DatabaseMigrations;

    public function test_valid_campaign_is_stored_and_recipient_jobs_are_queued(): void
    {
        Queue::fake([ProcessEmailJob::class]);

        $response = $this->postJson('/api/campaigns', [
            'name' => 'Spring Sale',
            'subject' => '50% Off This Weekend!',
            'body' => 'Check out our amazing deals...',
            'recipient_emails' => [
                'email1@test.com',
                'email2@test.com',
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('campaign_id', 1)
            ->assertJsonPath('recipient_count', 2)
            ->assertJsonPath('status', 'queued');

        $this->assertDatabaseHas('campaigns', [
            'id' => 1,
            'name' => 'Spring Sale',
            'subject' => '50% Off This Weekend!',
            'body' => 'Check out our amazing deals...',
            'recipient_count' => 2,
            'status' => 'queued',
        ]);
        $this->assertDatabaseCount('email_jobs', 2);
        $this->assertDatabaseHas('email_jobs', [
            'campaign_id' => 1,
            'recipient_email' => 'email1@test.com',
            'status' => 'pending',
        ]);
        $this->assertDatabaseHas('email_jobs', [
            'campaign_id' => 1,
            'recipient_email' => 'email2@test.com',
            'status' => 'pending',
        ]);

        Queue::assertPushed(ProcessEmailJob::class, 2);
    }

    public function test_missing_campaign_fields_return_422_without_creating_records(): void
    {
        Queue::fake([ProcessEmailJob::class]);

        $response = $this->postJson('/api/campaigns', []);

        $response->assertUnprocessable()
            ->assertJsonPath('error', 'Invalid input')
            ->assertJsonStructure([
                'details' => ['name', 'subject', 'body', 'recipient_emails'],
            ]);

        $this->assertDatabaseCount('campaigns', 0);
        $this->assertDatabaseCount('email_jobs', 0);
        Queue::assertNothingPushed();
    }

    public function test_invalid_and_duplicate_recipient_emails_return_422(): void
    {
        $response = $this->postJson('/api/campaigns', [
            'name' => 'Spring Sale',
            'subject' => '50% Off This Weekend!',
            'body' => 'Check out our amazing deals...',
            'recipient_emails' => [
                'not-an-email',
                'duplicate@test.com',
                'DUPLICATE@test.com',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonPath('error', 'Invalid input')
            ->assertJsonStructure([
                'details' => ['recipient_emails.0', 'recipient_emails.2'],
            ]);

        $this->assertDatabaseCount('campaigns', 0);
        $this->assertDatabaseCount('email_jobs', 0);
    }
}
