<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyFolioFieldInRequisicionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('requisicions', function (Blueprint $table) {
            // Cambiar el tamaño del campo 'folio' a 15 caracteres
            $table->string('folio', 15)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('requisicions', function (Blueprint $table) {
            // Revertir el campo 'folio' a 10 caracteres
            $table->string('folio', 10)->change();
        });
    }
}

