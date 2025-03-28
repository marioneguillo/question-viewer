<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class TrainingLibraryController extends BaseController
{
    public function index()
    {
        return Inertia::render('TrainingLibrary/Index');
    }   

    public function index2()
    {
        return Inertia::render('TrainingLibrary/Index2');
    }
} 