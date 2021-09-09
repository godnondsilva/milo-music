<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <app-upload ref="upload" :addSong="addSong" />
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">{{ $t('manage.my_songs') }}</span>
              <i class="fa fa-compact-disc float-right text-blue-600 text-2xl"></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <composition-item v-for="(song, i) in songs"
              :song="song"
              :key="song.docID"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import AppUpload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { songsCollection, auth } from '@/includes/firebase';
import { where, query, getDocs } from 'firebase/firestore';
// import store from '@/store';

export default {
  name: 'manage',
  components: {
    AppUpload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    // query to get songs uploaded by the current user
    const songsQuery = query(
      songsCollection,
      where('uid', '==', auth.currentUser.uid),
    );
    // snapshot of all the documents (is a list)
    const songsSnapshots = await getDocs(songsQuery);

    // since the snapshot is a list, each song has to be individually added to the songs array
    songsSnapshots.forEach(this.addSong);
  },
  methods: {
    // this function is called by the child component CompositionItem
    // this modidies the name and genre of the song LOCALLY
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    // this function is called by the child component CompositionItem
    // removes the song from the songs array
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    // this function is called either by the child component Upload
    // everytime a file is uploaded
    // or it will be called on loading the manage page
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };
      // pushes the song to the songs array
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm('You have unsaved changed. Are you sure you want to leave?');
      next(leave);
    }
  },
};
</script>
