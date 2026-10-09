<?php

use App\Http\Controllers\Api\CampaignController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
Route::post('/campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
Route::get('/campaigns/{campaign}', [CampaignController::class, 'show'])->name('campaigns.show');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
