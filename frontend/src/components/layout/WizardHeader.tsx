import { WizardSteps, type WizardStep } from '../../design-system/visuals';
import { useAuditSession } from '../../state/session';

export const WIZARD_LABELS = ['Produto', 'Perfil', 'Intents', 'Prompts', 'Execução'];

/** Cabeçalho de etapas usado nas telas do wizard de criação do audit. */
export function WizardHeader({ currentIndex }: { currentIndex: number }) {
  const { draft } = useAuditSession();
  const id = draft?.audit.id;

  const steps: WizardStep[] = WIZARD_LABELS.map((label, i) => ({
    id: `step-${i}`,
    label,
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
