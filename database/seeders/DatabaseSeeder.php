namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Question::create([
            'title' => 'Pregunta de prueba 1',
            'description' => 'Esta es una pregunta de prueba',
            'answered' => false
        ]);

        Question::create([
            'title' => 'Pregunta de prueba 2',
            'description' => 'Esta es otra pregunta de prueba',
            'answered' => true
        ]);
    }
} 