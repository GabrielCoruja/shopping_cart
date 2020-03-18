import React from 'react';
import { connect } from 'react-redux';

import { addPhone, addWine, addGlass } from '../store/actions/product';

const ProductList = ({ products, addPhone, addWine, addGlass,
  quantityPhone, quantityWine, quantityGlass,
}) => (
  <div>
    <h2>Produtos disponíveis</h2>
    <table>
      <thead>
        <tr>
        <th>Título</th>
        <th>Preço</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{products[0].title}</td>
          <td>R${products[0].price}</td>
          <td>
            <button type="button" onClick={() => addPhone(products[0])} disabled={quantityPhone === 5}>
              Adicionar
            </button>
          </td>
        </tr>
        <tr>
          <td>{products[1].title}</td>
          <td>R${products[1].price}</td>
          <td>
            <button type="button" onClick={() => addWine(products[1])} disabled={quantityWine === 5}>
              Adicionar
            </button>
            </td>
        </tr>
        <tr>
          <td>{products[2].title}</td>
          <td>R${products[2].price}</td>
          <td>
            <button type="button" onClick={() => addGlass(products[2])} disabled={quantityGlass === 5}>
              Adicionar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const mapStateToProps = (state) => ({
  quantityPhone: state.product.quantityPhone,
  quantityWine: state.product.quantityWine,
  quantityGlass: state.product.quantityGlass,
  products: state.product.products,
});

const mapDispatchToProps = (dispatch) => ({
  addPhone: (product) => dispatch(addPhone(product)),
  addWine: (product) => dispatch(addWine(product)),
  addGlass: (product) => dispatch(addGlass(product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
