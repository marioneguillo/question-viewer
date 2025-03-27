<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class BadgeController extends BaseController
{
    public function index()
    {
        // Aquí irá la lógica para obtener los badges del usuario
        // Por ahora usamos datos de ejemplo
        $badges = [
            [
                'id' => 1,
                'name' => 'Title',
                'description' => 'Description',
                'image' => '/images/AZ-900-badge.png',
                'earned' => true,
                'progress' => 1,
                'required' => 1
            ],
            [
                'id' => 2,
                'name' => 'Title',
                'description' => 'Description',
                'image' => '/images/AZ-900-badge.png',
                'earned' => true,
                'progress' => 1,
                'required' => 1
            ],
            [
                'id' => 3,
                'name' => 'Title',
                'description' => 'Description',
                'image' => '/images/AZ-900-badge.png',
                'earned' => true,
                'progress' => 1,
                'required' => 1
            ],
            [
                'id' => 4,
                'name' => 'Title',
                'description' => 'Description',
                'image' => '/images/AZ-900-badge.png',
                'earned' => true,
                'progress' => 1,
                'required' => 1
            ]
        ];

        return Inertia::render('Badges/Index', [
            'badges' => $badges
        ]);
    }
} 