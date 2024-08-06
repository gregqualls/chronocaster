<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segment extends Model
{
    protected $fillable = ['name', 'description', 'session_id'];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }
}

