import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useTranslation } from '@/composables/useTranslation'

export function generateTestReport(test) {
  const { t } = useTranslation()
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

function formatDate(date) {
  if (!date) return ''
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return ''
  return dateObj.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatDuration(duration) {
  if (!duration) return ''
  if (duration.endsWith('m')) return duration
  if (duration.endsWith(' min')) return duration.replace(' min', 'm')
  return `${duration}m`
} 