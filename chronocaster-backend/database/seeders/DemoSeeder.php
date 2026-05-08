<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAdminUser();

        if (Program::count() > 0) {
            return;
        }

        $podcast = Program::create([
            'name'             => 'The Long Road Podcast',
            'description'      => 'Long-form interviews, weekly.',
            'default_duration' => 44 * 60,
            'recurrence'       => 'weekly',
        ]);

        $allHands = Program::create([
            'name'             => 'Internal All-Hands',
            'description'      => 'Quarterly company update.',
            'default_duration' => 60 * 60,
        ]);

        $launch = Program::create([
            'name'             => 'Marketing Launch',
            'description'      => 'Product launch livestreams.',
            'default_duration' => 90 * 60,
        ]);

        $this->createUnit($podcast, 'Episode 042 — The Long Road', Carbon::now()->addMinutes(35), 'ready', [
            ['Cold Open',                  60],
            ['Welcome & Housekeeping',     180],
            ['Guest Intro: Dr. Avery',     90],
            ['Main Interview',             1500],
            ['Audience Q&A',               600],
            ['Sponsor Read',               90],
            ['Closing & CTA',              120],
        ]);

        $this->createUnit($allHands, 'Q3 All-Hands', Carbon::now()->addDay(), 'scheduled', [
            ['Welcome',          180],
            ['Quarter Numbers',  900],
            ['Product Updates',  1200],
            ['People & Hiring',  600],
            ['Q&A',              720],
        ]);

        $this->createUnit($launch, 'Product Launch: Aurora', Carbon::now()->addDays(6), 'scheduled', [
            ['Pre-roll Loop',     300],
            ['Opening Keynote',   1500],
            ['Demo: Aurora',      1800],
            ['Customer Stories',  900],
            ['Pricing & Avail.',  600],
            ['Q&A',               600],
            ['Closing',           300],
        ]);

        $this->createUnit($podcast, 'Episode 041 — Origins', Carbon::now()->subDays(3), 'completed', [
            ['Cold Open',     60],
            ['Origins Story', 1500],
            ['Q&A',           600],
            ['Closing',       120],
        ]);
    }

    private function seedAdminUser(): void
    {
        $email = env('DEMO_ADMIN_EMAIL', 'admin@chronocaster.local');
        $password = env('DEMO_ADMIN_PASSWORD', 'chronocaster');

        $user = User::firstOrNew(['email' => $email]);
        $user->name = $user->name ?: 'Admin';
        if (! $user->exists) {
            $user->password = Hash::make($password);
        }
        $user->save();

        if ($user->roles()->count() === 0) {
            $user->assignRole('Super Admin');
        }
    }

    private function createUnit(Program $program, string $name, Carbon $when, string $status, array $segments): Unit
    {
        $unit = Unit::create([
            'program_id'   => $program->id,
            'name'         => $name,
            'scheduled_at' => $when,
            'timezone'     => 'UTC',
            'status'       => $status,
        ]);

        foreach ($segments as $i => [$segName, $duration]) {
            $unit->segments()->create([
                'name'     => $segName,
                'duration' => $duration,
                'position' => $i,
            ]);
        }

        return $unit;
    }
}
