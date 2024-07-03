<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCompra extends Model
{
    use HasFactory;

    protected $table = 'orden_compra';
    protected $primaryKey = 'id_compra';
    public $incrementing = true;
    protected $fillable = [
        'precio_unitario',
        'importe_parcial',
        'id_requisicion',
        'no_orden_compra',
        'evidencia_de_entrega',
    ];

    // Relación con Compra
    public function compra()
    {
        return $this->belongsTo(Compra::class, 'no_orden_compra', 'no_orden_compra');
    }

    public function requisicion()
    {
        return $this->belongsTo(Requisicion::class, 'id_requisicion', 'id_requisicion');
    }
}

