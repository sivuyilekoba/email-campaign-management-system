<?php

namespace Database\Factories;

use App\EmailJobStatus;
use App\Models\Campaign;
use App\Models\EmailJob;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmailJob>
 */
class EmailJobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'campaign_id' => Campaign::factory(),
            'recipient_email' => fake()->unique()->safeEmail(),
            'status' => EmailJobStatus::Pending,
        ];
    }
}
