<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::with('options')->get()->map(function ($question) {
            $question->type_label = $this->getTypeLabel($question->type);
            return $question;
        });
        
        return Inertia::render('Questions/Index', [
            'questions' => $questions
        ]);
    }

    protected function getTypeLabel($type)
    {
        $labels = [
            'single_choice' => 'Opción Única',
            'multiple_choice' => 'Opción Múltiple',
            'drag_drop' => 'Arrastrar y Soltar',
            'reorder_list' => 'Ordenar Lista'
        ];
        return $labels[$type] ?? $type;
    }

    public function create(Request $request)
    {
        return Inertia::render('Questions/Create', [
            'type' => $request->query('type', 'single_choice')
        ]);
    }

    public function show(Question $question)
    {
        $question->load('options');
        return Inertia::render('Questions/Show', [
            'question' => [
                'id' => $question->id,
                'stem' => $question->stem,
                'type' => $question->type,
                'explanation' => $question->explanation,
                'background_text' => $question->background_text,
                'slots' => $question->slots,
                'options' => $question->options ? $question->options->map(function ($option) use ($question) {
                    $data = [
                        'id' => $option->id,
                        'text' => $option->text,
                        'selected' => false
                    ];
                    
                    if ($question->type === 'reorder_list') {
                        $data['correct_order'] = $option->correct_order;
                    } else {
                        $data['is_correct'] = $option->is_correct;
                    }
                    
                    return $data;
                }) : []
            ]
        ]);
    }

    public function launch(Question $question)
    {
        $question->load('options');
        
        // Obtener todas las preguntas ordenadas por ID
        $questions = Question::orderBy('id')->get();
        $totalQuestions = $questions->count();
        
        // Encontrar el índice actual y las preguntas anterior/siguiente
        $currentIndex = $questions->search(function($q) use ($question) {
            return $q->id === $question->id;
        });
        
        // Obtener IDs de preguntas anterior y siguiente si existen
        $previousQuestionId = $currentIndex > 0 ? $questions[$currentIndex - 1]->id : null;
        $nextQuestionId = $currentIndex < ($totalQuestions - 1) ? $questions[$currentIndex + 1]->id : null;

        return Inertia::render('Questions/Launch', [
            'question' => [
                'id' => $question->id,
                'stem' => $question->stem,
                'type' => $question->type,
                'explanation' => $question->explanation,
                'background_text' => $question->background_text,
                'slots' => $question->slots,
                'options' => $question->options ? $question->options->map(function ($option) use ($question) {
                    $data = [
                        'id' => $option->id,
                        'text' => $option->text
                    ];
                    
                    if ($question->type === 'reorder_list') {
                        $data['correct_order'] = $option->correct_order;
                    } else {
                        $data['is_correct'] = $option->is_correct;
                    }
                    
                    return $data;
                }) : []
            ],
            'totalQuestions' => $totalQuestions,
            'currentQuestionIndex' => $currentIndex,
            'navigation' => [
                'previousQuestionId' => $previousQuestionId,
                'nextQuestionId' => $nextQuestionId
            ]
        ]);
    }

    public function start(Question $question)
    {
        $question->load('options');
        return Inertia::render('Questions/Start', [
            'question' => [
                'id' => $question->id,
                'stem' => $question->stem,
                'type' => $question->type,
                'options' => $question->options ? $question->options->map(function ($option) use ($question) {
                    $data = [
                        'id' => $option->id,
                        'text' => $option->text
                    ];
                    
                    if ($question->type === 'reorder_list') {
                        $data['correct_order'] = $option->correct_order;
                    }
                    
                    return $data;
                }) : []
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateQuestion($request);
        $data = $this->prepareQuestionData($validated);

        $question = Question::create($data);

        foreach ($validated['options'] as $option) {
            $questionOption = [
                'text' => $option['text'],
                'order' => isset($option['order']) ? $option['order'] : 0
            ];

            if ($question->type === 'reorder_list') {
                $questionOption['correct_order'] = $option['correct_order'];
            } else {
                $questionOption['is_correct'] = $option['is_correct'] ?? false;
            }

            $question->options()->create($questionOption);
        }

        return redirect()->route('questions.index');
    }

    public function edit(Question $question)
    {
        $question->load('options');
        return Inertia::render('Questions/Edit', [
            'question' => [
                'id' => $question->id,
                'stem' => $question->stem,
                'type' => $question->type,
                'explanation' => $question->explanation,
                'options' => $question->options ? $question->options->map(function ($option) use ($question) {
                    $data = [
                        'id' => $option->id,
                        'text' => $option->text,
                        'order' => $option->order
                    ];
                    
                    if ($question->type === 'reorder_list') {
                        $data['correct_order'] = $option->correct_order;
                    } else {
                        $data['is_correct'] = $option->is_correct;
                    }
                    
                    return $data;
                }) : []
            ]
        ]);
    }

    public function update(Request $request, Question $question)
    {
        $validated = $this->validateQuestion($request);
        $data = $this->prepareQuestionData($validated);

        $question->update($data);

        // Eliminar opciones existentes y crear nuevas
        $question->options()->delete();
        
        foreach ($validated['options'] as $option) {
            $questionOption = [
                'text' => $option['text'],
                'order' => isset($option['order']) ? $option['order'] : 0
            ];

            if ($question->type === 'reorder_list') {
                $questionOption['correct_order'] = $option['correct_order'];
            } else {
                $questionOption['is_correct'] = $option['is_correct'] ?? false;
            }

            $question->options()->create($questionOption);
        }

        return redirect()->route('questions.show', $question);
    }

    public function destroy(Question $question)
    {
        // Primero eliminamos las opciones relacionadas
        $question->options()->delete();
        
        // Luego eliminamos la pregunta
        $question->delete();

        return redirect()->route('dashboard');
    }

    public function view(Question $question)
    {
        $question->load('options');
        return Inertia::render('Questions/View', [
            'question' => [
                'id' => $question->id,
                'stem' => $question->stem,
                'type' => $question->type,
                'explanation' => $question->explanation,
                'background_text' => $question->background_text,
                'slots' => $question->slots,
                'options' => $question->options ? $question->options->map(function ($option) use ($question) {
                    $data = [
                        'id' => $option->id,
                        'text' => $option->text
                    ];
                    
                    if ($question->type === 'reorder_list') {
                        $data['correct_order'] = $option->correct_order;
                    } else {
                        $data['is_correct'] = $option->is_correct;
                    }
                    
                    return $data;
                }) : []
            ]
        ]);
    }

    public function startAll()
    {
        $questions = Question::with('options')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'stem' => $question->stem,
                    'type' => $question->type,
                    'explanation' => $question->explanation,
                    'background_text' => $question->background_text,
                    'slots' => $question->slots,
                    'options' => $question->options ? $question->options->map(function ($option) use ($question) {
                        $data = [
                            'id' => $option->id,
                            'text' => $option->text,
                            'selected' => false
                        ];
                        
                        if ($question->type === 'reorder_list') {
                            $data['correct_order'] = $option->correct_order;
                        } else {
                            $data['is_correct'] = $option->is_correct;
                        }
                        
                        return $data;
                    }) : []
                ];
            });

        return Inertia::render('Questions/StartAll', [
            'questions' => $questions
        ]);
    }

    protected function validateQuestion(Request $request)
    {
        $rules = [
            'type' => ['required', 'in:single_choice,multiple_choice,drag_drop,reorder_list'],
            'stem' => ['required', 'string'],
            'explanation' => ['nullable', 'string'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.text' => ['required', 'string'],
        ];

        if ($request->type === 'reorder_list') {
            $rules['options.*.correct_order'] = ['required', 'integer', 'min:1'];
            // Validar que los órdenes sean únicos y consecutivos
            $rules['options'] = array_merge($rules['options'], [
                function ($attribute, $value, $fail) {
                    $orders = collect($value)->pluck('correct_order')->filter();
                    
                    // Verificar que todos los elementos tengan un orden
                    if ($orders->count() !== count($value)) {
                        $fail('Todos los elementos deben tener un orden asignado.');
                        return;
                    }

                    // Verificar que los órdenes sean únicos
                    if ($orders->unique()->count() !== $orders->count()) {
                        $fail('Los órdenes deben ser únicos.');
                        return;
                    }

                    // Verificar que los órdenes sean consecutivos
                    $expectedOrders = range(1, count($value));
                    if ($orders->sort()->values()->toArray() !== $expectedOrders) {
                        $fail('Los órdenes deben ser consecutivos del 1 al ' . count($value));
                    }
                }
            ]);
        } elseif ($request->type === 'single_choice' || $request->type === 'multiple_choice') {
            $rules['options.*.is_correct'] = ['required', 'boolean'];
            // Al menos una opción debe ser correcta
            $rules['options'] = array_merge($rules['options'], [
                function ($attribute, $value, $fail) use ($request) {
                    if (!collect($value)->contains('is_correct', true)) {
                        $fail('Al menos una opción debe ser correcta.');
                    }
                }
            ]);
        } elseif ($request->type === 'drag_drop') {
            $rules['slots_count'] = ['required', 'integer', 'min:1'];
            $rules['slots'] = ['required', 'array'];
            $rules['slots.*'] = ['required', 'integer', 'min:1'];
        }

        return $request->validate($rules);
    }

    protected function prepareQuestionData($validatedData)
    {
        return [
            'stem' => $validatedData['stem'],
            'type' => $validatedData['type'],
            'explanation' => $validatedData['explanation'] ?? null,
        ];
    }
} 