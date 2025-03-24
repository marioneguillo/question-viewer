import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useTranslation() {
  const { t: $t, locale } = useI18n()
  
  const t = (key, params = {}) => {
    return $t(key, params)
  }

  const setLocale = (newLocale) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  // Cargar la preferencia guardada al iniciar
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    setLocale(savedLocale)
  }

  return {
    t,
    setLocale,
    locale
  }
} 