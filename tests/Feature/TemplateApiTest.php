<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class TemplateApiTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        return [
            'name' => 'Welcome template',
            'blocks' => [
                ['id' => 'b1', 'type' => 'header', 'text' => 'Welcome!'],
                ['id' => 'b2', 'type' => 'button', 'label' => 'Get started', 'url' => 'https://example.com'],
            ],
        ];
    }

    public function test_a_valid_template_can_be_created(): void
    {
        $response = $this->postJson('/api/templates', $this->validPayload());

        $response->assertCreated()
            ->assertJsonPath('id', 1)
            ->assertJsonPath('name', 'Welcome template')
            ->assertJsonPath('blocks.0.type', 'header')
            ->assertJsonPath('blocks.1.label', 'Get started');

        $this->assertDatabaseHas('templates', ['id' => 1, 'name' => 'Welcome template']);
    }

    public function test_missing_fields_return_422(): void
    {
        $response = $this->postJson('/api/templates', []);

        $response->assertUnprocessable()
            ->assertJsonPath('error', 'Invalid input')
            ->assertJsonStructure(['details' => ['name', 'blocks']]);

        $this->assertDatabaseCount('templates', 0);
    }

    public function test_an_unknown_block_type_is_rejected(): void
    {
        $payload = $this->validPayload();
        $payload['blocks'][0]['type'] = 'video';

        $response = $this->postJson('/api/templates', $payload);

        $response->assertUnprocessable()
            ->assertJsonPath('error', 'Invalid input')
            ->assertJsonStructure(['details' => ['blocks.0.type']]);
    }

    public function test_templates_are_listed_with_a_pagination_envelope(): void
    {
        $this->postJson('/api/templates', $this->validPayload());

        $response = $this->getJson('/api/templates');

        $response->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonPath('data.0.name', 'Welcome template')
            ->assertJsonPath('meta.total', 1);
    }

    public function test_a_template_can_be_shown(): void
    {
        $this->postJson('/api/templates', $this->validPayload());

        $response = $this->getJson('/api/templates/1');

        $response->assertOk()
            ->assertJsonPath('id', 1)
            ->assertJsonPath('blocks.0.text', 'Welcome!');
    }

    public function test_a_template_can_be_updated(): void
    {
        $this->postJson('/api/templates', $this->validPayload());

        $response = $this->putJson('/api/templates/1', [
            'name' => 'Updated template',
            'blocks' => [['id' => 'b3', 'type' => 'text', 'text' => 'Changed']],
        ]);

        $response->assertOk()
            ->assertJsonPath('name', 'Updated template')
            ->assertJsonPath('blocks.0.type', 'text');

        $this->assertDatabaseHas('templates', ['id' => 1, 'name' => 'Updated template']);
    }

    public function test_a_template_can_be_deleted(): void
    {
        $this->postJson('/api/templates', $this->validPayload());

        $response = $this->deleteJson('/api/templates/1');

        $response->assertNoContent();

        $this->assertDatabaseCount('templates', 0);
    }
}
