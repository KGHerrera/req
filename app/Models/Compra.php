<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;

    protected $table = 'compras';
    protected $primaryKey = 'no_orden_compra';
    public $incrementing = true;
    protected $fillable = [
        'no_orden_compra',
        'proveedor',
        'fecha_entrega',
        'IVA',
        'total',
    ];

    // Relación con OrdenCompra
    public function ordenesCompra()
    {
        return $this->hasMany(OrdenCompra::class, 'no_orden_compra', 'no_orden_compra');
    }
}

