import { useTranslation } from 'react-i18next';
import { WizardSteps, type WizardStep } from '../../design-system/visuals';
import { useAuditSession } from '../../state/session';
import { pageTitle, useDocumentTitle } from '../../i18n/seo';

export const WIZARD_STEPS = ['product', 'profile', 'intents', 'prompts', 'execution'] as const;

/** Cabeçalho de etapas usado nas telas do wizard de criação do audit. */
export function WizardHeader({ currentIndex }: { currentIndex: number }) {
  const { draft } = useAuditSession();
  const { t } = useTranslation('audit');
  const id = draft?.audit.id;
  const step = WIZARD_STEPS[currentIndex] ?? WIZARD_STEPS[0];
  useDocumentTitle(pageTitle(t(`wizard.${step}`)));

  const steps: WizardStep[] = WIZARD_STEPS.map((step, i) => ({
    id: `step-${i}`,
    label: t(`wizard.${step}`),
    to: i === 0 ? '/audit/new' : id ? stepPath(i, id) : undefined,
  }));

  return (
    <div style={{ marginBottom: 'var(--sp-6)' }}>
      <WizardSteps steps={steps} currentIndex={currentIndex} />
    </div>
  );
}

export function stepPath(index: number, auditId: string): string {
  switch (index) {
    case 1:
      return `/audit/${auditId}/profile`;
    case 2:
      return `/audit/${auditId}/intents`;
    case 3:
      return `/audit/${auditId}/prompts`;
    case 4:
      return `/audit/${auditId}/progress`;
    default:
      return '/audit/new';
  }
}
