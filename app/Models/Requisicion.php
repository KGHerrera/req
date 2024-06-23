<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requisicion extends Model
{
    use HasFactory;

    protected $table = 'requisicions';

    protected $fillable = [
        'partida_presupuestal',
        'cantidad',
        'unidad',
        'descripcion_bienes_servicios',
        'costo_estimado',
        'folio',
    ];

    // Relación con el modelo Folio
    public function folio()
    {
        return $this->belongsTo(Folio::class, 'folio', 'folio');
    }
}
