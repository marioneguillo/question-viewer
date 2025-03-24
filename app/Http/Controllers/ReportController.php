<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class ReportController extends BaseController
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }
}
