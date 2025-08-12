export const locales = ['el', 'en', 'ru', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'el'
