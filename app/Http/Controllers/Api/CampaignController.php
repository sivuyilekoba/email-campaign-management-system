<?php

namespace App\Http\Controllers\Api;

use App\CampaignStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCampaignRequest;
use App\Http\Resources\CampaignDetailResource;
use App\Http\Resources\CampaignResource;
use App\Http\Resources\CampaignSubmissionResource;
use App\Jobs\ProcessEmailJob;
use App\Models\Campaign;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CampaignController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $campaigns = Campaign::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(15);

        return CampaignResource::collection($campaigns);
    }

    public function store(StoreCampaignRequest $request): CampaignSubmissionResource
    {
        $campaign = DB::transaction(function () use ($request): Campaign {
            $validated = $request->validated();
            $recipients = $validated['recipient_emails'];

            $campaign = Campaign::query()->create([
                'name' => $validated['name'],
                'subject' => $validated['subject'],
                'body' => $validated['body'],
                'recipient_count' => count($recipients),
                'status' => CampaignStatus::Queued,
            ]);

            foreach ($recipients as $recipientEmail) {
                $emailJob = $campaign->emailJobs()->create([
                    'recipient_email' => $recipientEmail,
                ]);

                ProcessEmailJob::dispatch($emailJob->id)->afterCommit();
            }

            return $campaign;
        });

        return new CampaignSubmissionResource($campaign);
    }

    public function show(Campaign $campaign): CampaignDetailResource
    {
        $campaign->load('emailJobs');

        return new CampaignDetailResource($campaign);
    }
}
