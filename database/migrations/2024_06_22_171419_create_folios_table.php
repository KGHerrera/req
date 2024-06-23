<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFoliosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('folios', function (Blueprint $table) {
            $table->string('folio', 10)->primary();
            $table->date('fecha_solicitud');
            $table->date('fecha_entrega')->nullable();
            $table->decimal('total_estimado', 9, 2);
            $table->string('estado', 20);
            $table->string('clave_departamento');
            $table->foreign('clave_departamento')->references('clave_departamento')->on('departamentos')->onDelete('cascade'); // Asegúrate que 'clave' es la columna correcta en 'departamentos'
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
        Schema::dropIfExists('folios');
    }
}

