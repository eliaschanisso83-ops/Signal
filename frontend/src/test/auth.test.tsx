import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

/* O env de teste tem o Supabase configurado — sem este mock a UI tentaria
   falar com a rede e os guardas bloqueariam o fluxo de demonstração. */
vi.mock('../services/auth', async () => (await import('./authStub')).authModule);

import App from '../App';
import { authStub, makeSession } from './authStub';

function go(path: string) {
  window.history.replaceState({}, '', path);
}

/* O AuthProvider restaura a sessão de forma assíncrona: as telas entram
   "carregando" e os elementos só aparecem depois — por isso findBy*. */
const T = { timeout: 5000 };

/* O marcador de obrigatório "*" fica dentro do <label> ("Email*"), então o
   casamento é feito pelo início do texto. */
function labelRe(text: string): RegExp {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
}

async function fillLogin(email: string, password: string) {
  fireEvent.change(await screen.findByLabelText(labelRe('Email'), {}, T), { target: { value: email } });
  fireEvent.change(await screen.findByLabelText(labelRe('Password'), {}, T), { target: { value: password } });
}

beforeEach(() => {
  /* enabled: true = Supabase Auth configurado; sessão vazia = anônimo. */
  authStub.reset();
});

describe('Guardas de rota', () => {
  it('bloqueia /audit/new para anônimo e leva ao login preservando o destino', async () => {
    go('/audit/new');
    render(<App />);
    await waitFor(() =>
      expect(`${window.location.pathname}${window.location.search}`).toBe('/login?next=%2Faudit%2Fnew'),
    );
  });

  it('com sessão ativa, /login redireciona para o destino pedido', async () => {
    authStub.reset({ session: makeSession() });
    go(`/login?next=${encodeURIComponent('/audit/new')}`);
    render(<App />);
    await waitFor(() => expect(`${window.location.pathname}${window.location.search}`).toBe('/audit/new'));
  });

  it('ignora destino externo em ?next= (anti open-redirect)', async () => {
    go(`/login?next=${encodeURIComponent('//evil.com/rota')}`);
    render(<App />);
    await fillLogin('ana@signal.test', 'segredo123');
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in' }, T));
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(window.location.host).not.toContain('evil.com');
  });
});

describe('Login', () => {
  it('autentica por e-mail e segue para o destino', async () => {
    go(`/login?next=${encodeURIComponent('/audit/new')}`);
    render(<App />);

    await fillLogin('ana@signal.test', 'segredo123');
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in' }, T));

    await waitFor(() => expect(window.location.pathname).toBe('/audit/new'));
    expect(authStub.calls).toContain('signInWithPassword:ana@signal.test');
  });

  it('mostra o erro mapeado de credenciais inválidas', async () => {
    authStub.failSignIn('errors.invalidCredentials');
    go('/login');
    render(<App />);

    await fillLogin('ana@signal.test', 'errada');
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in' }, T));

    const alert = await screen.findByRole('alert', {}, T);
    expect(alert.textContent).toContain('Email or password is incorrect.');
    expect(window.location.pathname).toBe('/login');
  });

  it('“Continuar com Google” volta para /auth/callback preservando o destino', async () => {
    go(`/login?next=${encodeURIComponent('/audit/new')}`);
    render(<App />);

    fireEvent.click(await screen.findByRole('button', { name: 'Continue with Google' }, T));

    await waitFor(() => expect(window.location.pathname).toBe('/audit/new'));
    const call = authStub.calls.find((c) => c.startsWith('signInWithGoogle:'));
    expect(call).toContain('/auth/callback?next=%2Faudit%2Fnew');
  });
});

describe('Cadastro', () => {
  it('valida confirmação de senha divergente e senha fraca', async () => {
    go('/register');
    render(<App />);

    fireEvent.change(await screen.findByLabelText(labelRe('Email'), {}, T), { target: { value: 'novo@signal.test' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Password'), {}, T), { target: { value: 'senha-longa-1' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Confirm password'), {}, T), { target: { value: 'senha-diferente' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Create account' }, T));

    expect((await screen.findByRole('alert', {}, T)).textContent).toContain('Passwords do not match.');

    fireEvent.change(await screen.findByLabelText(labelRe('Password'), {}, T), { target: { value: 'curta' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Confirm password'), {}, T), { target: { value: 'curta' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Create account' }, T));

    expect((await screen.findByRole('alert', {}, T)).textContent).toContain('Use at least 8 characters');
    expect(authStub.calls.filter((c) => c.startsWith('signUpWithPassword'))).toHaveLength(0);
  });

  it('respeita a confirmação de e-mail: mostra o painel sem criar sessão', async () => {
    authStub.needsConfirmation(true);
    go('/register');
    render(<App />);

    fireEvent.change(await screen.findByLabelText(labelRe('Email'), {}, T), { target: { value: 'novo@signal.test' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Password'), {}, T), { target: { value: 'senha-longa-1' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Confirm password'), {}, T), { target: { value: 'senha-longa-1' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Create account' }, T));

    expect(await screen.findByRole('heading', { name: 'Check your email' }, T)).toBeTruthy();
    expect(screen.getByText(/novo@signal\.test/)).toBeTruthy();
    expect(authStub.session).toBeNull();
  });

  it('sem confirmação obrigatória, entra direto na conta', async () => {
    go('/register');
    render(<App />);

    fireEvent.change(await screen.findByLabelText(labelRe('Email'), {}, T), { target: { value: 'novo@signal.test' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Password'), {}, T), { target: { value: 'senha-longa-1' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Confirm password'), {}, T), { target: { value: 'senha-longa-1' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Create account' }, T));

    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(authStub.session).not.toBeNull();
  });
});

describe('Recuperação de senha', () => {
  it('sempre mostra a mesma confirmação, sem revelar se a conta existe', async () => {
    go('/forgot-password');
    render(<App />);

    fireEvent.change(await screen.findByLabelText(labelRe('Email'), {}, T), { target: { value: 'ana@signal.test' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Send reset link' }, T));

    expect(await screen.findByRole('heading', { name: 'Check your email' }, T)).toBeTruthy();
    expect(authStub.calls).toContain('sendPasswordReset:ana@signal.test');
    expect(authStub.calls).toContain(`resetRedirect:${window.location.origin}/reset-password`);
  });

  it('sem sessão no /reset-password, expira o link com instrução de novo pedido', async () => {
    go('/reset-password');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Link invalid or expired' }, T)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Request a new link' })).toBeTruthy();
  });

  it('com sessão de recuperação, redefine e encerra a sessão em seguida', async () => {
    authStub.reset({ session: makeSession() });
    go('/reset-password');
    render(<App />);

    fireEvent.change(await screen.findByLabelText(labelRe('New password'), {}, T), { target: { value: 'nova-senha-123' } });
    fireEvent.change(await screen.findByLabelText(labelRe('Confirm new password'), {}, T), { target: { value: 'nova-senha-123' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Set new password' }, T));

    expect(await screen.findByRole('heading', { name: 'Password updated' }, T)).toBeTruthy();
    expect(authStub.calls).toContain('updateUserPassword');
    expect(authStub.calls).toContain('signOut');
    expect(authStub.session).toBeNull();
  });
});

describe('Callback do OAuth', () => {
  it('com sessão pronta, segue para o destino pedido', async () => {
    authStub.reset({ session: makeSession() });
    go(`/auth/callback?next=${encodeURIComponent('/audit/new')}`);
    render(<App />);
    await waitFor(() => expect(window.location.pathname).toBe('/audit/new'), { timeout: 5000 });
  });

  it('explica quando o usuário cancela no Google', async () => {
    go('/auth/callback?error=access_denied&error_description=User+did+not+approve');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Sign-in cancelled' }, T)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Try again' })).toBeTruthy();
  });

  it('sem sessão e sem erro, informa a falha com nova tentativa', async () => {
    go('/auth/callback');
    render(<App />);
    expect(await screen.findByRole('heading', { name: "We couldn't complete the sign-in" }, { timeout: 8000 })).toBeTruthy();
  });
});

describe('Conta no topo', () => {
  it('exibe o usuário logado e encerra a sessão ao sair', async () => {
    authStub.reset({ session: makeSession() });
    go('/');
    render(<App />);

    expect(await screen.findByText('Ana Signal', {}, T)).toBeTruthy();

    fireEvent.click(await screen.findByRole('button', { name: 'Sign out' }, T));

    await waitFor(() => expect(authStub.calls).toContain('signOut'));
    await waitFor(() => expect(screen.queryByText('Ana Signal')).toBeNull());
    expect(authStub.session).toBeNull();
  });

  it('sem sessão, oferece o acesso pelo topo', async () => {
    go('/');
    render(<App />);
    expect(await screen.findByRole('link', { name: 'Sign in' }, T)).toBeTruthy();
  });
});
