<?php

namespace App\Http\Controllers;

use App\Http\Resources\SegmentResource;
use App\Models\Segment;
use App\Models\Unit;
use Illuminate\Http\Request;

class SegmentController extends Controller
{
    public function index(Unit $unit)
    {
        return SegmentResource::collection($unit->segments);
    }

    public function store(Request $request, Unit $unit)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration'    => ['required', 'integer', 'min:0'],
            'position'    => ['nullable', 'integer', 'min:0'],
        ]);

        $position = $data['position']
            ?? (((int) $unit->segments()->max('position')) + 1);

        $segment = $unit->segments()->create(array_merge($data, ['position' => $position]));

        return new SegmentResource($segment);
    }

    public function update(Request $request, Unit $unit, Segment $segment)
    {
        abort_unless($segment->unit_id === $unit->id, 404);

        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration'    => ['sometimes', 'integer', 'min:0'],
            'position'    => ['sometimes', 'integer', 'min:0'],
        ]);

        $segment->update($data);

        return new SegmentResource($segment);
    }

    public function destroy(Unit $unit, Segment $segment)
    {
        abort_unless($segment->unit_id === $unit->id, 404);

        $segment->delete();

        return response()->noContent();
    }

    public function reorder(Request $request, Unit $unit)
    {
        $data = $request->validate([
            'order'   => ['required', 'array'],
            'order.*' => ['integer', 'exists:segments,id'],
        ]);

        foreach ($data['order'] as $index => $segmentId) {
            $unit->segments()->whereKey($segmentId)->update(['position' => $index]);
        }

        return SegmentResource::collection($unit->fresh('segments')->segments);
    }
}
