<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->string('share_token', 32)->nullable()->unique()->after('paused_at');
        });

        // Backfill existing units with random tokens.
        foreach (DB::table('units')->whereNull('share_token')->pluck('id') as $id) {
            DB::table('units')->where('id', $id)->update([
                'share_token' => Str::random(24),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropUnique(['share_token']);
            $table->dropColumn('share_token');
        });
    }
};
