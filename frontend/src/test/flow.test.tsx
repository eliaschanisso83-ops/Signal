import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    click('Iniciar auditoria');

    /* ---- 1. Configurar produto ---- */
    await expectHeading('Configurar o produto', 1);
    click('Criar rascunho e continuar');
    await expectHeading('Perfil interpretado do produto', 1);

    /* ---- 2. Perfil ---- */
    click('Revisar intents →');

    /* ---- 3. Intents ---- */
    await expectHeading('Revisar intents', 1);
    expect(screen.getByText('Acompanhar fluxo de caixa')).toBeTruthy();
    click('Revisar prompts →');

    /* ---- 4. Prompts ---- */
    await expectHeading('Revisar prompts', 1);
    expect(screen.getByText(/Intent ≠ Prompt/)).toBeTruthy();

    /* ---- 5. Execução ---- */
    click('Iniciar auditoria');
    await expectHeading('Executando a auditoria', 1);

    /* máquina simulada: ~6s de pipeline + redirect automático de 1,8s */
    await expectHeading('Auditoria concluída', 1);

    /* ---- Relatório (resumo) ---- */
    await expectHeading('Relatório de discoverability', 1);

    /* cadeia causal obrigatória: observação → evidência → hipótese → ação */
    expect(screen.getAllByText('Observação').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Evidência').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hipótese').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ação').length).toBeGreaterThan(0);

    /* scores com proveniência */
    expect(screen.getByRole('img', { name: /Discoverability: \d+ de 100/ })).toBeTruthy();
    expect(screen.getAllByText('Discoverability Score').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fórmula v/).length).toBeGreaterThan(0);

    /* ---- Evidências ---- */
    fireEvent.click(screen.getByRole('link', { name: 'Evidências' }));
    await expectHeading('Força da evidência por intent', 2);
    expect(screen.getByText('Lacunas identificadas', { selector: 'h2' })).toBeTruthy();
    expect(screen.getByText('Evidência bruta observada', { selector: 'h2' })).toBeTruthy();

    /* ---- Oportunidades & ações ---- */
    fireEvent.click(screen.getByRole('link', { name: 'Oportunidades & ações' }));
    await expectHeading('Oportunidades priorizadas', 2);
    expect(screen.getByText('Ações recomendadas com rastreabilidade', { selector: 'h2' })).toBeTruthy();
    expect(screen.getAllByText('COMO VALIDAR').length).toBeGreaterThan(0);

    /* zero chamadas externas nesta fase */
    if (fetchSpy) expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('Guardas de sessão e rotas', () => {
  it('redireciona relatório sem sessão para a criação', async () => {
    window.history.replaceState({}, '', '/audit/desconhecido/report');
    render(<App />);
    await expectHeading('Configurar o produto', 1);
  });

  it('redireciona progresso sem sessão para a criação', async () => {
    window.history.replaceState({}, '', '/audit/desconhecido/progress');
    render(<App />);
    await expectHeading('Configurar o produto', 1);
  });

  it('exibe 404 para rota inexistente', async () => {
    window.history.replaceState({}, '', '/rota/que-nao-existe');
    render(<App />);
    await expectHeading('Página não encontrada', 1);
  });
});
