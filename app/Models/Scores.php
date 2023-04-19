<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Scores extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'GameMode',
        'score'

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
