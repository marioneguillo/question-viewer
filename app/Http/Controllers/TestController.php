<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Routing\Controller;

class TestController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'totalQuestions' => 0,
            'answeredQuestions' => 0,
            'averageAnswers' => 0,
            'recentQuestions' => []
        ]);
    }
} 