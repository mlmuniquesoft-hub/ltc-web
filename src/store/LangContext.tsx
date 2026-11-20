import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { DICT, type Lang, type TKey } from '../lib/i18n'

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TKey, vars?: Record<string, string | number>) => string
  pick: <T>(en: T, bn: T | null | undefined) => T
}

const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    localStorage.getItem('ltc_lang') === 'EN' ? 'EN' : 'BN',
  )

  useEffect(() => {
    document.documentElement.lang = lang === 'BN' ? 'bn' : 'en'
  }, [lang])

  const setLang = (l: Lang) => {
    localStorage.setItem('ltc_lang', l)
    setLangState(l)
  }

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => {
      let text = DICT[lang][key] ?? DICT.EN[key]
      if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v))
      return text
    },
    [lang],
  )

  const pick = useCallback(
    <T,>(en: T, bn: T | null | undefined): T => (lang === 'BN' && bn != null && bn !== '' ? bn : en),
    [lang],
  )

  return <LangContext.Provider value={{ lang, setLang, t, pick }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
