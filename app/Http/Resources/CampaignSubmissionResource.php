<?php

namespace App\Http\Resources;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignSubmissionResource extends JsonResource
{
    /**
     * @return array<string, int|string>
     */
    public function toArray(Request $request): array
    {
        return [
            'campaign_id' => $this->id,
            'recipient_count' => $this->recipient_count,
            'status' => $this->status->value,
        ];
    }

    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->setStatusCode(201);
    }
}
