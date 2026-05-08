<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dateTime('scheduled_at')->nullable()->after('description');
            $table->string('timezone', 64)->default('UTC')->after('scheduled_at');
            $table->string('status', 16)->default('draft')->after('timezone');
            $table->dateTime('started_at')->nullable()->after('status');
            $table->dateTime('completed_at')->nullable()->after('started_at');
            $table->foreignId('host_id')->nullable()->after('completed_at')->constrained('users')->nullOnDelete();
            $table->foreignId('current_segment_id')->nullable()->after('host_id')->constrained('segments')->nullOnDelete();
            $table->dateTime('current_segment_started_at')->nullable()->after('current_segment_id');
            $table->dateTime('paused_at')->nullable()->after('current_segment_started_at');

            $table->index('status');
            $table->index('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['scheduled_at']);
            $table->dropForeign(['current_segment_id']);
            $table->dropForeign(['host_id']);
            $table->dropColumn([
                'scheduled_at',
                'timezone',
                'status',
                'started_at',
                'completed_at',
                'host_id',
                'current_segment_id',
                'current_segment_started_at',
                'paused_at',
            ]);
        });
    }
};
