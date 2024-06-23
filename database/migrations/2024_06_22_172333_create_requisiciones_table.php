<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequisicionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requisicions', function (Blueprint $table) {
            $table->increments('id_requisicion');
            $table->string('partida_presupuestal', 6);
            $table->integer('cantidad');
            $table->string('unidad', 20);
            $table->string('descripcion_bienes_servicios', 100);
            $table->decimal('costo_estimado', 9, 2);
            $table->string('folio', 10);
            $table->foreign('folio')->references('folio')->on('folios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('requisicions');
    }
}

