import { auth, usersDocWithID } from '@/includes/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

export default {
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    // toggle authentication modal
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    // toggle user logged in state
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  actions: {
    // action to register the user
    async register({ commit }, payload) {
      await createUserWithEmailAndPassword(auth, payload.email, payload.password).then((userCred) => {
        // Registered!
        // Add remaining data in the firestore
        setDoc(usersDocWithID(userCred.user.uid), {
          name: payload.name,
          email: payload.email,
          age: payload.age,
          country: payload.country,
        });

        // update the firebase profile to add the displayName
        updateProfile(auth.currentUser, {
          displayName: payload.name,
        });

        commit('toggleAuth');
      });
    },
    // action to log the user in
    async login({ commit }, payload) {
      // using firebase's sign in with email and password function
      await signInWithEmailAndPassword(auth, payload.email, payload.password).then(() => {
        commit('toggleAuth');
      });
    },
    // this action is called everytime app is created and let's the user to the auth.currentUser given by firebase
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('toggleAuth');
      }
    },
    // action to sign the user out
    async signOut({ commit }) {
      await signOut(auth);
      commit('toggleAuth');
    },
  },
};
