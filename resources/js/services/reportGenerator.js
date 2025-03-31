import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateTestReport(test, t) {
  const doc = new jsPDF()
  
  // Configuración inicial
  doc.setFontSize(20)
  doc.text(test.name, 20, 20)
  doc.setFontSize(12)
  doc.text(test.description, 20, 30)
  
  // Último Intento
  doc.setFontSize(16)
  doc.text(t('reports.test.attempts.lastAttempt'), 20, 45)
  doc.setFontSize(12)
  
  if (test.lastAttempt) {
    const lastAttemptData = [
      [t('reports.test.attempts.date'), formatDate(test.lastAttempt.date)],
      [t('reports.test.attempts.mode'), test.lastAttempt.mode],
      [t('reports.test.attempts.score'), `${test.lastAttempt.score}%`],
      [t('reports.test.attempts.duration'), formatDuration(test.lastAttempt.duration)],
      [t('reports.test.attempts.correct'), test.lastAttempt.correctAnswers],
      [t('reports.test.attempts.incorrect'), test.lastAttempt.incorrectAnswers]
    ]
    
    autoTable(doc, {
      startY: 50,
      head: [],
      body: lastAttemptData,
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold' }
      }
    })
  }
  
  // Historial de Intentos
  doc.setFontSize(16)
  doc.text(t('reports.test.attempts.history'), 20, doc.lastAutoTable.finalY + 20)
  doc.setFontSize(12)
  
  const attemptsData = test.attempts.map(attempt => [
    formatDate(attempt.date),
    attempt.mode,
    `${attempt.score}%`,
    formatDuration(attempt.duration),
    attempt.correctAnswers,
    attempt.incorrectAnswers
  ])
  
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [
      [
        t('reports.test.attempts.date'),
        t('reports.test.attempts.mode'),
        t('reports.test.attempts.score'),
        t('reports.test.attempts.duration'),
        t('reports.test.attempts.correct'),
        t('reports.test.attempts.incorrect')
      ]
    ],
    body: attemptsData,
    theme: 'grid',
    styles: { fontSize: 10 }
  })
  
  // Objetivos
  doc.setFontSize(16)
  doc.text(t('reports.test.objectives.title'), 20, doc.lastAutoTable.finalY + 20)
  doc.setFontSize(12)
  
  const objectivesData = test.objectives.list.map(objective => [
    objective.name,
    `${objective.mastery}%`,
    objective.description
  ])
  
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [
      [
        t('reports.test.objectives.name'),
        t('reports.test.objectives.mastery'),
        t('reports.test.objectives.description')
      ]
    ],
    body: objectivesData,
    theme: 'grid',
    styles: { fontSize: 10 }
  })
  
  // Preguntas
  doc.setFontSize(16)
  doc.text(t('reports.test.questions.title'), 20, doc.lastAutoTable.finalY + 20)
  doc.setFontSize(12)
  
  const questionsData = test.questions.map(question => [
    question.text,
    question.objective,
    question.correct ? t('reports.test.questions.correct') : t('reports.test.questions.incorrect'),
    question.attempts
  ])
  
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [
      [
        t('reports.test.questions.question'),
        t('reports.test.questions.objective'),
        t('reports.test.questions.status'),
        t('reports.test.questions.attempts')
      ]
    ],
    body: questionsData,
    theme: 'grid',
    styles: { fontSize: 10 }
  })
  
  // Guardar el PDF
  doc.save(`${test.name.toLowerCase().replace(/\s+/g, '-')}-report.pdf`)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatDuration(duration) {
  if (!duration) return '00:00'
  try {
    const [hours, minutes] = duration.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes)) return '00:00'
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  } catch (error) {
    return '00:00'
  }
} 