<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Segment;
use App\Models\Unit;

class StatsController extends Controller
{
    public function index()
    {
        return [
            'programs' => Program::count(),
            'units' => Unit::count(),
            'segments' => Segment::count(),
        ];
    }
}
