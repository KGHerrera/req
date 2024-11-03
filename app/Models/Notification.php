<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'message',
        'folio',
        'viewed',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
