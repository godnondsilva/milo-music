<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click.prevent="deleteSong">
        <i class="fa fa-times"></i>
      </button>
      <button @click.prevent="showForm = !showForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert" :class="alert_variant">
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="formSchema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field name="modified_name" type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title" @input="updateUnsavedFlag(true)" />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field name="genre" type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button :disabled="in_submission" type="submit"
          class="py-1.5 px-3 mr-2 rounded text-white bg-green-600">Save</button>
        <button :disabled="in_submission" @click.prevent="showForm = false" type="button"
          class="py-1.5 px-3 rounded text-white bg-red-400">Close</button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { songsDocWithID, storage } from '@/includes/firebase';

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      formSchema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song information.',
    };
  },
  methods: {
    async edit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_message = 'Please wait! Updating song information.';

      const songDocument = songsDocWithID(this.song.docID);
      try {
        // updates the document with modified_name and genre
        await updateDoc(songDocument, values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Something went wrong! Please try again later.';
        return;
      }

      // this function is from the parent Manage, it is used to update the details LOCALLY
      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = 'bg-green-500';
      this.alert_message = 'Success! Your song was updated!';
      setTimeout(() => {
        this.showForm = false;
        this.show_alert = false;
      }, 2000);
    },

    async deleteSong() {
      // deletes the file in the STORAGE
      const songStorageRef = ref(storage, `songs/${this.song.original_name}`);
      deleteObject(songStorageRef);

      // deletes the file in the FIRESTORE
      const songDocRef = songsDocWithID(this.song.docID);
      await deleteDoc(songDocRef);

      // this function is called by the parent component Manage
      // removes the song from the song array
      this.removeSong(this.index);
    },
  },
};
</script>
