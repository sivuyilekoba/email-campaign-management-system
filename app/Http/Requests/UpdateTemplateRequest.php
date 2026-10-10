<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateTemplateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'blocks' => ['required', 'array'],
            'blocks.*.id' => ['required', 'string', 'max:255'],
            'blocks.*.type' => ['required', 'string', 'in:header,text,image,button'],
            'blocks.*.text' => ['nullable', 'string', 'max:10000'],
            'blocks.*.label' => ['nullable', 'string', 'max:255'],
            'blocks.*.url' => ['nullable', 'string', 'max:2048'],
            'blocks.*.alt' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        $details = collect($validator->errors()->messages())
            ->map(fn (array $messages): string => $messages[0])
            ->all();

        throw new HttpResponseException(response()->json([
            'error' => 'Invalid input',
            'details' => $details,
        ], 422));
    }
}
