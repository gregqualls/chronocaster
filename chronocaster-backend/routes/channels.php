<?php

use App\Models\Unit;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('unit.{unitId}', function ($user, int $unitId) {
    $unit = Unit::find($unitId);
    if (! $unit) {
        return false;
    }

    return $unit->crew()->whereKey($user->id)->exists()
        || $user->hasAnyRole(['Director', 'Host', 'Viewer', 'Super Admin']);
});
