import { createStore } from 'vuex';

// Automated imports
import modules from './modules';

// Modules -- directly
// import auth from './modules/auth';
// import player from './modules/player';

export default createStore({
  modules,
});
