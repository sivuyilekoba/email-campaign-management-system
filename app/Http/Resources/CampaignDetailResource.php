<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class CampaignDetailResource extends CampaignResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'body' => $this->body,
            'email_jobs' => EmailJobResource::collection($this->whenLoaded('emailJobs')),
        ];
    }
}
