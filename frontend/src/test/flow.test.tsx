import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

/* O env de teste tem Supabase configurado: sem este mock a UI tentaria falar
   com a rede e os guardas de rota bloqueariam o percurso de demonstração. */
vi.mock('../services/auth', async () => (await import('./authStub')).authModule);

import App from '../App';

/** Clica no primeiro elemento com o texto indicado. */
function click(text: string) {
  fireEvent.click(screen.getAllByText(text)[0]);
}

async function expectHeading(name: string, level?: 1 | 2 | 3) {
  /* cobre latências simuladas do mock: criação (~700ms), pipeline (~6,8s)
     e redirect automático (1,8s) — acima do timeout padrão de 1s */
  return screen.findByRole('heading', level ? { name, level } : { name }, { timeout: 15000 });
}

describe('Fluxo completo da auditoria', () => {
  it('percorre Landing → wizard → execução → relatório → evidências → oportunidades', async () => {
    const fetchSpy = typeof fetch === 'function' ? vi.spyOn(globalThis, 'fetch') : null;

    render(<App />);

    /* ---- Landing ---- */
    expect(screen.getByAltText('Signal — signal.biz-flow.cloud')).toBeTruthy();
    click('Start audit');

    /* ---- 1. Configurar produto ---- */
    await expectHeading('Configure the product', 1);
    click('Create draft and continue');
    await expectHeading('Interpreted product profile', 1);

    /* ---- 2. Perfil ---- */
    click('Review intents →');

    /* ---- 3. Intents ---- */
    await expectHeading('Review intents', 1);
    expect(screen.getByText('Acompanhar fluxo de caixa')).toBeTruthy();
    click('Review prompts →');

    /* ---- 4. Prompts ---- */
    await expectHeading('Review prompts', 1);
    expect(screen.getByText(/Intent ≠ Prompt/)).toBeTruthy();

    /* ---- 5. Execução ---- */
    click('Start audit');
    await expectHeading('Running the audit', 1);

    /* máquina simulada: ~6s de pipeline + redirect automático de 1,8s */
    await expectHeading('Audit completed', 1);

    /* ---- Relatório (resumo) ---- */
    await expectHeading('Discoverability report', 1);

    /* cadeia causal obrigatória: observação → evidência → hipótese → ação */
    expect(screen.getAllByText('Observation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Evidence').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hypothesis').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Action').length).toBeGreaterThan(0);

    /* scores com proveniência */
    expect(screen.getByRole('img', { name: /Discoverability: \d+ of 100/ })).toBeTruthy();
    expect(screen.getAllByText('Discoverability Score').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/formula v/).length).toBeGreaterThan(0);

    /* ---- Evidências ---- */
    fireEvent.click(screen.getByRole('link', { name: 'Evidence' }));
    await expectHeading('Evidence strength by intent', 2);
    expect(screen.getByText('Gaps identified', { selector: 'h2' })).toBeTruthy();
    expect(screen.getByText('Observed raw evidence', { selector: 'h2' })).toBeTruthy();

    /* ---- Oportunidades & ações ---- */
    fireEvent.click(screen.getByRole('link', { name: 'Opportunities & actions' }));
    await expectHeading('Prioritized opportunities', 2);
    expect(screen.getByText('Recommended actions with traceability', { selector: 'h2' })).toBeTruthy();
    expect(screen.getAllByText('HOW TO VALIDATE').length).toBeGreaterThan(0);

    /* zero chamadas externas nesta fase */
    if (fetchSpy) expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('Guardas de sessão e rotas', () => {
  it('redireciona relatório sem sessão para a criação', async () => {
    window.history.replaceState({}, '', '/audit/desconhecido/report');
    render(<App />);
    await expectHeading('Configure the product', 1);
  });

  it('redireciona progresso sem sessão para a criação', async () => {
    window.history.replaceState({}, '', '/audit/desconhecido/progress');
    render(<App />);
    await expectHeading('Configure the product', 1);
  });

  it('exibe 404 para rota inexistente', async () => {
    window.history.replaceState({}, '', '/rota/que-nao-existe');
    render(<App />);
    await expectHeading('Page not found', 1);
  });
});
