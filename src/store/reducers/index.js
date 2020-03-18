import { combineReducers } from 'redux';

import { reducer as product } from './product';

export default combineReducers({
  product,
});
