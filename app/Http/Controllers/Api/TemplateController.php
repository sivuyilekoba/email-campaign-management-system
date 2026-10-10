<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTemplateRequest;
use App\Http\Requests\UpdateTemplateRequest;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class TemplateController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $templates = Template::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(15);

        return TemplateResource::collection($templates);
    }

    public function store(StoreTemplateRequest $request): JsonResponse
    {
        $template = Template::query()->create([
            'name' => $request->validated('name'),
            'blocks' => $request->input('blocks'),
        ]);

        return (new TemplateResource($template))->response()->setStatusCode(201);
    }

    public function show(Template $template): TemplateResource
    {
        return new TemplateResource($template);
    }

    public function update(UpdateTemplateRequest $request, Template $template): TemplateResource
    {
        $template->update([
            'name' => $request->validated('name'),
            'blocks' => $request->input('blocks'),
        ]);

        return new TemplateResource($template);
    }

    public function destroy(Template $template): Response
    {
        $template->delete();

        return response()->noContent();
    }
}
