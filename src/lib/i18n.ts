import 'server-only'

const dictionaries = {
  el: () => import('@/i18n/el.json').then(m => m.default),
  en: () => import('@/i18n/en.json').then(m => m.default),
  ru: () => import('@/i18n/ru.json').then(m => m.default),
  zh: () => import('@/i18n/zh.json').then(m => m.default),
}

export async function getDictionary(locale: string){
  const loader = (dictionaries as any)[locale] || dictionaries.el
  return loader()
}
