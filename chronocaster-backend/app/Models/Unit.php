<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory;

    public const STATUS_DRAFT     = 'draft';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_READY     = 'ready';
    public const STATUS_LIVE      = 'live';
    public const STATUS_PAUSED    = 'paused';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'program_id',
        'name',
        'description',
        'scheduled_at',
        'timezone',
        'status',
        'started_at',
        'completed_at',
        'host_id',
        'current_segment_id',
        'current_segment_started_at',
        'paused_at',
        'share_token',
    ];

    protected static function booted(): void
    {
        static::creating(function (Unit $unit) {
            if (empty($unit->share_token)) {
                $unit->share_token = \Illuminate\Support\Str::random(24);
            }
        });
    }

    protected $casts = [
        'scheduled_at'                  => 'datetime',
        'started_at'                    => 'datetime',
        'completed_at'                  => 'datetime',
        'current_segment_started_at'    => 'datetime',
        'paused_at'                     => 'datetime',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function segments(): HasMany
    {
        return $this->hasMany(Segment::class)->orderBy('position');
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function currentSegment(): BelongsTo
    {
        return $this->belongsTo(Segment::class, 'current_segment_id');
    }

    public function crew(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'unit_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function isLive(): bool
    {
        return in_array($this->status, [self::STATUS_LIVE, self::STATUS_PAUSED], true);
    }
}
