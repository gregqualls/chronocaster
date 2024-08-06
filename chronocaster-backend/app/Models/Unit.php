<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['name', 'description', 'program_id'];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function segments()
    {
        return $this->hasMany(Segment::class);
    }
}
