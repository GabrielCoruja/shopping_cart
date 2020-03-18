import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { reducer } from './store/reducers/product';
import App from './App';

function renderWithRedux(
  ui,
  { initialState, store = createStore(reducer, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}
describe('initial itens in the page', () => {
  afterEach(cleanup);

  test('render initial itens', () => {
    const { getByText, getAllByText } = renderWithRedux(<App />);
    const results = getByText('Carrinho de compras');
    expect(results).toBeInTheDocument();
    expect(getByText(/Produtos disponíveis/i)).toBeInTheDocument();
    expect(getByText(/Título/i)).toBeInTheDocument();
    expect(getByText(/Preço/i)).toBeInTheDocument();
    expect(getByText(/20.89/i)).toBeInTheDocument();
    expect(getByText(/57/i)).toBeInTheDocument();
    expect(getByText(/5.45/i)).toBeInTheDocument();
    expect(getByText(/Total: R/)).toBeInTheDocument();
    expect(getByText(/0.00/i)).toBeInTheDocument();

    const phone = getAllByText(/Fone de ouvido/i);
    const wine = getAllByText(/Vinho do porto/i);
    const glass = getAllByText(/Copo lagoinha/i);

    expect(phone[0]).toBeInTheDocument();
    expect(phone[1]).toBeInTheDocument();
    expect(wine[0]).toBeInTheDocument();
    expect(wine[1]).toBeInTheDocument();
    expect(glass[0]).toBeInTheDocument();
    expect(glass[1]).toBeInTheDocument();

    const initialQuantity = getAllByText(/0X/i);
    expect(initialQuantity.length).toBe(3);

    const addButton = getAllByText(/Adicionar/i);
    expect(addButton[0]).toBeEnabled();
    expect(addButton[1]).toBeEnabled();
    expect(addButton[2]).toBeEnabled();
    expect(addButton.length).toBe(3);
    expect(addButton[0].tagName).toBe('BUTTON');
  });

  test('add products to the cart', () => {
    const { getByText, getAllByText } = renderWithRedux(<App />);
    const addButton = getAllByText(/Adicionar/i);

    fireEvent.click(addButton[0]);
    fireEvent.click(addButton[1]);
    fireEvent.click(addButton[2]);
    expect(getByText(/Fone de ouvido 1X/i)).toBeInTheDocument();
    expect(getByText(/Vinho do porto 1X/i)).toBeInTheDocument();
    expect(getByText(/Copo lagoinha 1X/i)).toBeInTheDocument();
    expect(getByText(/83.34/i)).toBeInTheDocument();

    const numberClicksDisabled = 5;

    for (let index = 1; index < numberClicksDisabled; index += 1) {
      fireEvent.click(addButton[0]);
      fireEvent.click(addButton[1]);
      fireEvent.click(addButton[2]);
    }
    expect(addButton[0]).toBeDisabled();
    expect(addButton[1]).toBeDisabled();
    expect(addButton[2]).toBeDisabled();

    expect(getByText(/Fone de ouvido 5X/i)).toBeInTheDocument();
    expect(getByText(/Vinho do porto 5X/i)).toBeInTheDocument();
    expect(getByText(/Copo lagoinha 5X/i)).toBeInTheDocument();
    expect(getByText(/416.70/i)).toBeInTheDocument();
  });
});
