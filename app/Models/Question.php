<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'stem',
        'explanation',
        'type',
        'slots',
        'answered'
    ];

    protected $casts = [
        'slots' => 'array',
        'answered' => 'boolean'
    ];

    protected $with = ['options'];

    const TYPES = [
        'single_choice' => 'Opción Única',
        'multiple_choice' => 'Opción Múltiple',
        'drag_drop' => 'Arrastrar y Soltar',
        'reorder_list' => 'Ordenar Lista'
    ];

    public function options()
    {
        return $this->hasMany(Option::class)->orderBy('order');
    }

    public function getOptionsAttribute()
    {
        return $this->options()->get();
    }
}
