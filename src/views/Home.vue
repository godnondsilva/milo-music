<template>
  <main>
    <!-- Introduction -->
    <section class="py-20 text-white text-center relative">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg" style="background-image: url(assets/img/song-header.png)"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">
            {{ $t('home.listen') }}
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ $t('home.desc') }}
          </p>
        </div>
      </div>

      <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full" src="assets/img/introduction-music.png" />
    </section>

    <!-- Main Content -->
    <section class="bg-gray-300 pt-8 pb-8">
      <section class="container mx-auto">
        <div class="bg-gray-200 rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-300">
            <i v-icon.right="'headphones-alt'"></i>
            <span class="card-title">
              {{ $t('home.songs') }}
            </span>
            <!-- Icon -->
          </div>
          <!-- Playlist -->
          <ol id="playlist">
            <app-song-item v-for="song in songs" :key="song.docID" :song="song"/>
          </ol>
          <!-- .. end Playlist -->
        </div>
      </section>
    </section>
  </main>
</template>

<script>
import {
  query, limit, startAfter, orderBy, getDocs, getDoc,
} from 'firebase/firestore';
import { songsCollection, songsDocWithID } from '@/includes/firebase';
import AppSongItem from '@/components/SongItem.vue';
import IconSecondary from '@/directives/icon-secondary';

export default {
  name: 'Home',
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequest: false,
    };
  },
  directives: {
    'icon-secondary': IconSecondary,
  },
  components: {
    AppSongItem,
  },
  async created() {
    // on loading the page, get the songs the first time
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      // calculate to find the time when user hits the bottom part of the page
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      // when user hits the bottom of the page, call getSongs()
      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      // used to reduce spam, if there is a pending request, end the function
      if (this.pendingRequest) {
        return;
      }
      // if no pending request, then set true to start new process
      this.pendingRequest = true;

      let snapshotsQuery;

      // if songs.length is not 0
      if (this.songs.length) {
        // get the last document reference
        const lastDocRef = songsDocWithID(this.songs[this.songs.length - 1].docID);
        // get the doc data using the reference
        const lastDoc = await getDoc(lastDocRef);

        // create snapshot query using query option
        snapshotsQuery = query(songsCollection, orderBy('modified_name'), startAfter(lastDoc), limit(this.maxPerPage));
      } else {
        // if songs.length is 0, get from the 0th doc without any first order
        // create snapshot query using query option
        snapshotsQuery = query(songsCollection, orderBy('modified_name'), limit(this.maxPerPage));
      }

      // get the data using the snapshotsQuery
      const songsResults = await getDocs(snapshotsQuery);

      // push each document into the songs array which is used by the page to load data
      songsResults.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
  },
};
</script>
