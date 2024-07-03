<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orden_compra', function (Blueprint $table) {
            $table->id('id_compra');
            $table->decimal('precio_unitario', 9, 2);
            $table->decimal('importe_parcial', 9, 2);
            $table->unsignedInteger('id_requisicion');
            $table->foreign('id_requisicion')->references('id_requisicion')->on('requisicions')->onDelete('cascade');
            $table->unsignedBigInteger('no_orden_compra');
            $table->foreign('no_orden_compra')->references('no_orden_compra')->on('compras')->onDelete('cascade');
            $table->string('evidencia_de_entrega', 255)->nullable();
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
        Schema::dropIfExists('orden_compra');
    }
};
