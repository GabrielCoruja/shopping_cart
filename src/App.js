import React from 'react';

import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import { Provider } from 'react-redux';
import store from './store';


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <ProductList />
        <ShoppingCart />
      </Provider>
    </div>
  );
}

export default App;
