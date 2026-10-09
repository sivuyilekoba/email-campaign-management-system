<?php

namespace App\Models;

use App\CampaignStatus;
use App\EmailJobStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'subject', 'body', 'recipient_count', 'status'])]
class Campaign extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['status' => CampaignStatus::class];
    }

    /** @return HasMany<EmailJob, $this> */
    public function emailJobs(): HasMany
    {
        return $this->hasMany(EmailJob::class);
    }

    public function refreshProcessingStatus(): void
    {
        $hasPendingJobs = $this->emailJobs()
            ->where('status', EmailJobStatus::Pending->value)
            ->exists();

        $this->update([
            'status' => $hasPendingJobs ? CampaignStatus::Processing : CampaignStatus::Done,
        ]);
    }
}
