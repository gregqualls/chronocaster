<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('segments', function (Blueprint $table) {
            $table->dropForeign(['session_id']);
            $table->renameColumn('session_id', 'unit_id');
        });

        Schema::table('segments', function (Blueprint $table) {
            $table->foreign('unit_id')->references('id')->on('units')->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0)->after('description');
            $table->unsignedInteger('duration')->default(0)->after('position');
            $table->index(['unit_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::table('segments', function (Blueprint $table) {
            $table->dropIndex(['unit_id', 'position']);
            $table->dropColumn(['position', 'duration']);
            $table->dropForeign(['unit_id']);
            $table->renameColumn('unit_id', 'session_id');
        });

        Schema::table('segments', function (Blueprint $table) {
            $table->foreign('session_id')->references('id')->on('units')->cascadeOnDelete();
        });
    }
};
