<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folio extends Model
{
    use HasFactory;

    protected $primaryKey = 'folio';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'folio',
        'fecha_solicitud',
        'fecha_entrega',
        'total_estimado',
        'estado',
        'clave_departamento',
        'user_id',
    ];

    public function requisiciones()
    {
        return $this->hasMany(Requisicion::class, 'folio', 'folio');
    }
}
