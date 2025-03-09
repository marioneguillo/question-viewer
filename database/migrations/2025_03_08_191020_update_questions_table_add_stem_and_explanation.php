<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Agregar nuevas columnas
            $table->text('stem')->nullable(false)->after('id');
            $table->text('explanation')->nullable(false)->after('stem');
            $table->string('type')->default('single_choice')->after('explanation');
            
            // Eliminar columnas antiguas
            $table->dropColumn(['title', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Restaurar columnas antiguas
            $table->string('title')->after('id');
            $table->text('description')->nullable()->after('title');
            
            // Eliminar nuevas columnas
            $table->dropColumn(['stem', 'explanation', 'type']);
        });
    }
};
