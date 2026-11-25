import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { makeStore } from './store';

const renderApp = () => {
  const user = userEvent.setup();
  render(<App store={makeStore()} />);
  return { user };
};

const addProduct = (user: ReturnType<typeof userEvent.setup>, name: string) =>
  user.click(screen.getByRole('button', { name: `Adicionar ${name}` }));

describe('Loja Coruja', () => {
  it('mostra o catálogo e atualiza o contador do carrinho', async () => {
    const { user } = renderApp();
    expect(screen.getByText('12 produtos encontrados')).toBeInTheDocument();

    await addProduct(user, 'Fone de ouvido');
    await user.click(screen.getByRole('button', { name: 'Aumentar Fone de ouvido' }));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
  });

  it('filtra por categoria, busca e limpa os filtros', async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole('button', { name: 'Bebidas' }));
    expect(screen.getByText('2 produtos encontrados')).toBeInTheDocument();

    await user.type(screen.getByRole('searchbox', { name: 'Buscar produtos' }), 'xyz');
    expect(screen.getByText('Nenhum produto encontrado com esses filtros.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getByText('12 produtos encontrados')).toBeInTheDocument();
  });

  it('aplica cupom no carrinho e mostra o total com desconto', async () => {
    const { user } = renderApp();
    await addProduct(user, 'Fone de ouvido');
    await addProduct(user, 'Vinho do Porto');
    await user.click(screen.getByRole('button', { name: /Abrir carrinho/ }));

    const drawer = screen.getByRole('dialog', { name: 'Seu carrinho' });
    expect(within(drawer).getByText('🎉 Você ganhou frete grátis!')).toBeInTheDocument();

    await user.type(within(drawer).getByRole('textbox', { name: 'Cupom de desconto' }), 'invalido');
    await user.click(within(drawer).getByRole('button', { name: 'Aplicar' }));
    expect(within(drawer).getByRole('alert')).toHaveTextContent('Cupom inválido');

    await user.clear(within(drawer).getByRole('textbox', { name: 'Cupom de desconto' }));
    await user.type(within(drawer).getByRole('textbox', { name: 'Cupom de desconto' }), 'coruja10');
    await user.click(within(drawer).getByRole('button', { name: 'Aplicar' }));
    expect(within(drawer).getByTestId('cart-total')).toHaveTextContent('R$ 330,20');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('valida o checkout e confirma o pedido', async () => {
    const { user } = renderApp();
    await addProduct(user, 'Café especial');
    await user.click(screen.getByRole('button', { name: /Abrir carrinho/ }));
    await user.click(screen.getByRole('button', { name: 'Finalizar compra' }));

    const confirm = screen.getByRole('button', { name: /Confirmar pedido/ });
    await user.click(confirm);
    expect(screen.getByText('Informe seu nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome completo')).toHaveFocus();

    await user.type(screen.getByLabelText('Nome completo'), 'Maria Teste');
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com');
    await user.type(screen.getByLabelText('CEP'), '30130000');
    expect(screen.getByLabelText('CEP')).toHaveValue('30130-000');
    await user.type(screen.getByLabelText('Cidade'), 'Belo Horizonte');
    await user.type(screen.getByLabelText('Endereço (rua e número)'), 'Rua Exemplo, 100');
    await user.click(screen.getByLabelText('Boleto'));
    await user.click(confirm);

    expect(screen.getByRole('heading', { name: 'Pedido confirmado!' })).toBeInTheDocument();
    expect(screen.getByText(/Obrigado, Maria!/)).toBeInTheDocument();
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });
});
