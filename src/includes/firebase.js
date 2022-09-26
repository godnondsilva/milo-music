import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, collection, doc, enableIndexedDbPersistence,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDNjmZaRJMNft13E6DZzpiWcerE3sOhZ1o',
  authDomain: 'milo-music.firebaseapp.com',
  projectId: 'milo-music',
  storageBucket: 'milo-music.appspot.com',
  messagingSenderId: '340263517417',
  appId: '1:340263517417:web:93f9d2a4440a3d70d4c478',
  measurementId: 'G-LGPB87L4RX',
};

// Names of the collections in the firebase bucket
const collectionConfig = {
  users: 'users',
  songs: 'songs',
  comments: 'comments',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth();
const db = getFirestore();
enableIndexedDbPersistence(db)
  .catch((error) => {
    console.log(`Firebase persistence occurred. Error: ${error.code}`);
  });

const storage = getStorage(app);

const usersCollection = collection(db, collectionConfig.users);
// Used to get a single user doc reference, parameter is the id of the document
const usersDocWithID = (id) => doc(db, collectionConfig.users, id);

const songsCollection = collection(db, collectionConfig.songs);
// Used to get a single song doc reference, parameter is the id of the document
const songsDocWithID = (id) => doc(db, collectionConfig.songs, id);

const commentsCollection = collection(db, collectionConfig.comments);

export {
  auth,
  db,
  storage,
  usersCollection,
  usersDocWithID,
  songsCollection,
  songsDocWithID,
  commentsCollection,
};
