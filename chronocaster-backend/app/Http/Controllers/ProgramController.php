<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        return ProgramResource::collection(Program::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'image'            => ['nullable', 'string', 'max:1024'],
            'default_duration' => ['nullable', 'integer', 'min:0'],
            'recurrence'       => ['nullable', 'string', 'max:16'],
        ]);

        $program = Program::create($data);

        return new ProgramResource($program);
    }

    public function show(Program $program)
    {
        return new ProgramResource($program);
    }

    public function update(Request $request, Program $program)
    {
        $data = $request->validate([
            'name'             => ['sometimes', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'image'            => ['nullable', 'string', 'max:1024'],
            'default_duration' => ['nullable', 'integer', 'min:0'],
            'recurrence'       => ['nullable', 'string', 'max:16'],
        ]);

        $program->update($data);

        return new ProgramResource($program);
    }

    public function destroy(Program $program)
    {
        $program->delete();

        return response()->noContent();
    }
}
