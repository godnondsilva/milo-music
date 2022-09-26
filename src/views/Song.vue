<template>
  <main>
    <!-- Music Header -->
    <section class="fixed z-10 w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)">
      </div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
          focus:outline-none" id="play-button"
          @click.prevent="(currentSong.url === song.url) ? toggleAudio() : newSong(song)">
          <!-- Show play icon if the player is not playing OR song is not playing in this page -->
          <!-- Show pause icon if the player is playing AND song is playing in current page -->
          <i class="fa text-blue-400 text-xl" :class="{
            'fa-play': (!playing || currentSong.url !== song.url),
            'fa-pause': (playing && currentSong.url === song.url)
          }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-artist">Artist: {{ song.display_name }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">
            {{ $tc('song.comment_count', song.comment_count, {
            count: song.comment_count
            })
            }}
          </span>
          <i class="fa fa-comments float-right text-blue-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div class="text-white text-center font-bold p-4 mb-4" :class="comment_alert_variant"
            v-if="comment_show_alert">
            {{ comment_alert_message }}
          </div>
          <vee-form @submit="addComment" v-if="userLoggedIn">
            <vee-field as="textarea" name="comment" rules="required|min:3|max:300" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded mb-2" placeholder="Your comment here...">
            </vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button type="submit" :disabled="comment_in_submission"
              class="py-1.5 px-3 mt-2 rounded text-white bg-blue-600 block">
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select v-model="sortDir" class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded">
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li v-for="comment in sortedComments" :key="comment.docID" class="p-6 bg-gray-50 border border-gray-200">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songsDocWithID, auth, commentsCollection } from '@/includes/firebase';
import {
  getDoc, addDoc, query, where, getDocs, updateDoc,
} from 'firebase/firestore';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted!',
      comments: [],
      sortDir: '1', // 1 -> latest to oldest | 2 -> oldest to latest
    };
  },
  computed: {
    ...mapGetters(['playing', 'currentSong']),
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
    }),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sortDir === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  methods: {
    ...mapActions(['newSong', 'toggleAudio']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait! Your comment is being submitted!';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };
      // add the document to the comments collection in firebase
      await addDoc(commentsCollection, comment);
      // increase comment count
      this.song.comment_count += 1;
      // get the songs reference using the song id stored in route params
      const songsRef = songsDocWithID(this.$route.params.id);
      // update the songs document to increase the comment count in the song details
      await updateDoc(songsRef, {
        comment_count: this.song.comment_count,
      });

      // after adding the comment, get the new list of comments
      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_message = 'Success! Your comment has been added!';

      // clear the comment box to not have multiple submissions
      resetForm();
    },
    async getComments() {
      // get the snapshot quer and get the documents
      const snapshotsQuery = query(commentsCollection, where('sid', '==', this.$route.params.id));
      const commentsResults = await getDocs(snapshotsQuery);

      // set comments array as empty or else on every update it will duplicate
      this.comments = [];

      // for each comment result, push the comment to the array
      commentsResults.forEach((document) => {
        this.comments.push({
          docID: document.id,
          ...document.data(),
        });
      });
    },
  },
  async created() {
    const docSnapshot = await getDoc(songsDocWithID(this.$route.params.id));

    // ALERTNATE METHOD?: if (!docSnapshot.exists);
    // check if the document doesnt exist, if it doesnt, then send them back to home
    if (!docSnapshot.exists()) {
      this.$router.push({ name: 'home' });
      return;
    }

    // get the sort direction from the query parameter of the route
    const { sortDir } = this.$route.query;
    // set sortdir locally based on the query parameter value, if its missing, let it to 1
    this.sortDir = sortDir === '1' || sortDir === '2' ? sortDir : '1';

    // add the document data to the song local variable
    this.song = docSnapshot.data();
    // get comments when loading page
    this.getComments();
  },
  watch: {
    // watcher for sortDir variable
    sortDir(newVal) {
      // if sortDir value is same as the new value, no need to update
      // performance boost!
      if (newVal === this.$route.query.sortDir) {
        return;
      }

      // else, update the query parameter
      this.$router.push({
        query: {
          sortDir: newVal,
        },
      });
    },
  },
};
</script>
