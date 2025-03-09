<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TestController;

Route::get('/', function () {
    return redirect('/dashboard');
});


Route::get('/login', function () {
    return redirect('/dashboard');
})->name('login');


Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/questions/create', [QuestionController::class, 'create'])->name('questions.create');
Route::get('/questions', [QuestionController::class, 'index'])->name('questions.index');
Route::post('/questions', [QuestionController::class, 'store'])->name('questions.store');
Route::get('/questions/start-all', [QuestionController::class, 'startAll'])->name('questions.start-all');
Route::get('/questions/{question}/view', [QuestionController::class, 'view'])->name('questions.view');

// Rutas específicas antes de las rutas con parámetros dinámicos
Route::get('/questions/{question}/launch', [QuestionController::class, 'launch'])->name('questions.launch');
Route::get('/questions/{question}/edit', [QuestionController::class, 'edit'])->name('questions.edit');
Route::get('/questions/{question}/start', [QuestionController::class, 'start'])->name('questions.start');

// Rutas con parámetros dinámicos
Route::get('/questions/{question}', [QuestionController::class, 'show'])->name('questions.show');
Route::put('/questions/{question}', [QuestionController::class, 'update'])->name('questions.update');
Route::delete('/questions/{question}', [QuestionController::class, 'destroy'])->name('questions.destroy'); 