<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'text',
        'is_correct',
        'order',
        'correct_order'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'order' => 'integer',
        'correct_order' => 'integer'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
