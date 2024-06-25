<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMotivoRechazoToFoliosTable extends Migration
{
    public function up()
    {
        Schema::table('folios', function (Blueprint $table) {
            $table->string('motivo_rechazo')->nullable();
        });
    }

    public function down()
    {
        Schema::table('folios', function (Blueprint $table) {
            $table->dropColumn('motivo_rechazo');
        });
    }
}

