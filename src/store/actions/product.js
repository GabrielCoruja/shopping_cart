export const ADD_PHONE = 'ADD_PHONE';
export const ADD_WINE = 'ADD_WINE';
export const ADD_GLASS = 'ADD_GLASS';

export const addPhone = (product) => ({
  type: ADD_PHONE,
  product,
});

export const addWine = (product) => ({
  type: ADD_WINE,
  product,
});

export const addGlass = (product) => ({
  type: ADD_GLASS,
  product,
});
