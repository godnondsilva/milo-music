<template>
  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-black p-6 pb-2 text-left align-top w-full h-18">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 mt-1 leading-3">
        <button type="button" @click.prevent="toggleAudio" id="player-play-button">
          <i class="fa text-blue-400 text-xl" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left w-7 h-7 leading-3 text-white mt-3 text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">{{ seek }}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 mr-6 mt-2 player-scrub">
        <div class="absolute left-0 right-0 text-lg text-center text-white mx-auto player-song-info"
          v-if="currentSong.modified_name">
          <span class="song-title">{{ currentSong.modified_name }}</span> -
          <span class="song-artist">{{ currentSong.display_name }}</span>
        </div>
        <!-- Scrub Container  -->
        <span class="block w-full h-2 rounded m-1 mt-2 bg-gray-400 relative cursor-pointer" @click.prevent="updateSeek">
          <!-- Player Ball -->
          <span class="absolute top-neg-10 text-blue-600 text-lg" :style="{ left: `${playerProgress - 0.5}%` }">
            <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span class="block h-2 rounded bg-gradient-to-r from-blue-500 to-blue-400"
            :style="{ width: `${playerProgress}%` }"></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-white mt-3 text-lg w-14 ml-5 mt-1">
        <span class="player-duration">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'Player',
  computed: {
    ...mapGetters(['playing']),
    ...mapState({
      seek: (state) => state.player.seek,
      duration: (state) => state.player.duration,
      playerProgress: (state) => state.player.playerProgress,
      currentSong: (state) => state.player.currentSong,
    }),
  },
  methods: {
    ...mapActions(['toggleAudio', 'updateSeek']),
  },
};
</script>

<style scoped>
.top-neg-10 {
  top: -10px;
}
</style>
