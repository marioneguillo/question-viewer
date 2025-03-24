<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class DashboardController extends BaseController
{
    public function index()
    {
        // Datos de ejemplo para el dashboard
        $data = [
            'user' => [
                'name' => 'Mario',
                'completedLessons' => 6
            ],
            'coursesInProgress' => [
                [
                    'id' => 1,
                    'order' => 1,
                    'name' => 'Diseño y Composición',
                    'lessons' => 12,
                    'progress' => 54,
                ],
                [
                    'id' => 2,
                    'order' => 2,
                    'name' => 'UX Design Foundations',
                    'lessons' => 17,
                    'progress' => 83,
                ],
                [
                    'id' => 3,
                    'order' => 3,
                    'name' => '3D Design Foundations',
                    'lessons' => 13,
                    'progress' => 21,
                ]
            ],
            'stats' => [
                'coursesCompleted' => 2,
                'coursesInProgress' => 3,
                'hoursThisWeek' => 8.5
            ],
            'activityData' => [
                ['name' => 'Lun', 'value' => 60],
                ['name' => 'Mar', 'value' => 45],
                ['name' => 'Mié', 'value' => 75],
                ['name' => 'Jue', 'value' => 30],
                ['name' => 'Vie', 'value' => 85],
                ['name' => 'Sáb', 'value' => 25],
                ['name' => 'Dom', 'value' => 40]
            ],
            'upcomingActivities' => [
                [
                    'id' => 1,
                    'type' => 'lesson',
                    'title' => '3D Design Foundations',
                    'course' => 'Fundamentos de Diseño 3D',
                    'time' => '10:00 - 12:30',
                ],
                [
                    'id' => 2,
                    'type' => 'assignment',
                    'title' => 'Entrega del Proyecto Final',
                    'course' => 'UX Design Foundations',
                    'time' => '23:59',
                ]
            ]
        ];

        return Inertia::render('Dashboard', $data);
    }
} 