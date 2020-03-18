import { ADD_PHONE, ADD_WINE, ADD_GLASS } from '../actions/product';

export const INITIAL_STATE = {
  products: [{
    id: 1,
    title: 'Fone de ouvido',
    price: 20.89,
  }, {
    id: 2,
    title: 'Vinho do porto',
    price: 57,
  }, {
    id: 3,
    title: 'Copo lagoinha',
    price: 5.45,
  }],
  totalPrice: 0,
  quantityPhone: 0,
  quantityWine: 0,
  quantityGlass: 0,
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_PHONE:
      return {
        products: [
          ...state.products,
        ],
        totalPrice: state.totalPrice + action.product.price,
        quantityPhone: state.quantityPhone + 1,
        quantityWine: state.quantityWine,
        quantityGlass: state.quantityGlass,
      };
      case ADD_WINE:
      return {
        products: [
          ...state.products,
        ],
        totalPrice: state.totalPrice + action.product.price,
        quantityWine: state.quantityWine + 1,
        quantityPhone: state.quantityPhone,
        quantityGlass: state.quantityGlass,
      };
      case ADD_GLASS:
      return {
        products: [
          ...state.products,
        ],
        totalPrice: state.totalPrice + action.product.price,
        quantityGlass: state.quantityGlass + 1,
        quantityWine: state.quantityWine,
        quantityPhone: state.quantityPhone,
      };
    default:
      return state;
  }
};
