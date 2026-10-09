<?php

namespace Database\Factories;

use App\CampaignStatus;
use App\Models\Campaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true),
            'subject' => fake()->catchPhrase(),
            'body' => fake()->paragraphs(3, true),
            'recipient_count' => fake()->numberBetween(2, 5),
            'status' => CampaignStatus::Queued,
        ];
    }
}
