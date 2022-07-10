<template>
  <div class="col-span-1">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <i class="fas fa-upload float-right text-blue-600 text-2xl"></i>
      </div>
      <div class="p-6">
        <!-- Upload Dropbox -->
        <div class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{ 'bg-green-400 border-greed-400 border-solid': is_dragover }" @drag.prevent.stop=""
          @dragstart.prevent.stop="" @dragend.prevent.stop="is_dragover = false"
          @dragover.prevent.stop="is_dragover = true" @dragenter.prevent.stop="is_dragover = true"
          @dragleave.prevent.stop="is_dragover = false" @drop.prevent.stop="upload($event)">
          <h5>Drop your files here</h5>
        </div>
        <input type="file" multiple @change="upload($event)" />
        <hr class="my-6" />
        <!-- Progess Bars -->
        <div class="mb-4" v-for="upload in uploads" :key="upload.name">
          <!-- File Name -->
          <div class="font-bold text-sm" :class="upload.text_class">
            <i :class="upload.icon"></i> {{ upload.name }}
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div class="transition-all progress-bar" :class="upload.variant"
              :style="{ width: upload.current_progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { songsCollection, storage, auth } from '@/includes/firebase';

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  props: {
    addSong: {
      type: Function,
    },
  },
  methods: {
    upload($event) {
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        // check user online status
        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: `${file.name} | No internet access`,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          });
          return;
        }

        const songStorageRef = ref(storage, `songs/${file.name}`);
        const uploadTask = uploadBytesResumable(songStorageRef, file);

        // Gets the index of the uploaded file
        const uploadIndex = this.uploads.push({
          uploadTask,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;

        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].current_progress = progress;
        }, (error) => {
          this.uploads[uploadIndex].variant = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].text_class = 'text-red-400';

          console.log(error);
        }, async () => {
          const song = {
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: uploadTask.snapshot.ref.name,
            modified_name: uploadTask.snapshot.ref.name,
            genre: '',
            comment_count: 0,
          };

          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            song.url = downloadURL;
          });

          // add the document to firestore and create a reference
          const songDocRef = await addDoc(songsCollection, song);
          // get snapshot using that reference
          const songSnapshot = await getDoc(songDocRef);
          // call addSong which is a function of the parent component Manage
          // this function will add the song to the array of songs
          this.addSong(songSnapshot);

          this.uploads[uploadIndex].variant = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].text_class = 'text-green-400';
        });
      });

      this.is_dragover = false;
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.uploadTask.cancel();
    });
  },
};
</script>
