<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            if (Schema::hasColumn('programs', 'image')) {
                $table->string('image')->nullable()->change();
            } else {
                $table->string('image')->nullable()->after('description');
            }
            $table->string('description')->nullable()->change();
            if (! Schema::hasColumn('programs', 'default_duration')) {
                $table->unsignedInteger('default_duration')->nullable()->after('image');
            }
            if (! Schema::hasColumn('programs', 'recurrence')) {
                $table->string('recurrence', 16)->nullable()->after('default_duration');
            }
        });
    }

    public function down(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn(['default_duration', 'recurrence']);
        });
    }
};
