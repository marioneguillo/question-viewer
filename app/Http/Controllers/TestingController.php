<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class TestingController extends BaseController
{
    public function index()
    {
        $availableQuestions = Question::select('id', 'stem', 'type', 'answered')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'stem' => $question->stem,
                    'type' => $question->type,
                    'answered' => $question->answered,
                    'type_label' => match($question->type) {
                        'single_choice' => 'Opción Única',
                        'multiple_choice' => 'Opción Múltiple',
                        'drag_drop' => 'Arrastrar y Soltar',
                        'reorder_list' => 'Ordenar Lista',
                        default => 'Desconocido'
                    }
                ];
            });

        return Inertia::render('Testing/Index', [
            'availableQuestions' => $availableQuestions
        ]);
    }
} 