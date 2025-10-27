import { getLocales } from 'expo-localization';
import {I18n} from 'i18n-js';
import TextLocalized from './TextLocalized/Langs';

// Set i18n configuration
const i18n = new I18n(TextLocalized);
i18n.translations = TextLocalized;
i18n.locale = getLocales()[0].languageCode;

if (i18n.locale !== 'es' && i18n.locale !== 'fr' && i18n.locale !== 'en' && i18n.locale !== 'it' && i18n.locale !== 'de')  {
    i18n.locale = 'en';
}
//i18n.locale = 'fr';
//i18n.fallbacks = true;

export { i18n } ;