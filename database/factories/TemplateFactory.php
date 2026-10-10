<?php

namespace Database\Factories;

use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Template>
 */
class TemplateFactory extends Factory
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
            'blocks' => [
                ['id' => fake()->uuid(), 'type' => 'header', 'text' => fake()->sentence(4)],
                ['id' => fake()->uuid(), 'type' => 'text', 'text' => fake()->paragraph()],
                ['id' => fake()->uuid(), 'type' => 'button', 'label' => fake()->words(2, true), 'url' => fake()->url()],
            ],
        ];
    }
}
