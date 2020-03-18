import React from 'react';
import { connect } from 'react-redux';

const ShoppingCart = ({ products, totalPrice, quantityPhone, quantityWine, quantityGlass }) => (
  <div>
    <h2>Carrinho de compras</h2>
    <ul>
          <li>
            {products[0].title} {quantityPhone}X
          </li>
          <li>
            {products[1].title} {quantityWine}X
          </li>
          <li>
            {products[2].title} {quantityGlass}X
          </li>
    </ul>
    <div>Total: R${totalPrice.toFixed(2)}</div>
  </div>
);

const mapStateToProps = (state) => ({
  quantityPhone: state.product.quantityPhone,
  quantityWine: state.product.quantityWine,
  quantityGlass: state.product.quantityGlass,
  products: state.product.products,
  totalPrice: state.product.totalPrice,
});

export default connect(mapStateToProps)(ShoppingCart);
