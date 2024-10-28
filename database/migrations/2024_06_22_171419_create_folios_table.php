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
            $table->unsignedBigInteger('user_id'); // Agregamos la columna user_id como clave foránea
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Referencia a la tabla 'users'
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


