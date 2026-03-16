export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.como-crecer': '¿Cómo Crecer?',
    'nav.adn-socios': 'ADN Socios',
    'nav.servicios': 'Servicios',
    'nav.synerlink': 'Synerlink',
    'nav.contacto': 'Contacto',
  },
  en: {
    'nav.inicio': 'Home',
    'nav.como-crecer': 'How to Grow?',
    'nav.adn-socios': 'Partner DNA',
    'nav.servicios': 'Services',
    'nav.synerlink': 'Synerlink',
    'nav.contacto': 'Contact',
  },
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang]?.[key] || ui[defaultLang][key];
  };
}
