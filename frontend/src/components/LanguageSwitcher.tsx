import { useTranslation } from 'react-i18next';
import { LANGUAGES, changeUserLanguage } from '../i18n';

/**
 * Seletor de idioma compacto (select nativo, acessível).
 * O idioma escolhido é persistido em localStorage e aplicado sem reload.
 */
export function LanguageSwitcher({ id = 'lang-switch' }: { id?: string }) {
  const { t, i18n } = useTranslation('app');
  const current = i18n.resolvedLanguage ?? 'en';

  return (
    <span className="lang-switch">
      <label className="sr-only" htmlFor={id}>
        {t('language.label')}
      </label>
      <select
        id={id}
        className="select lang-select"
        value={current}
        onChange={(e) => changeUserLanguage(e.target.value)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName}
          </option>
        ))}
      </select>
    </span>
  );
}
