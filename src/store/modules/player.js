import { Howl } from 'howler';
import helper from '@/includes/helper';

export default {
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0',
  },
  getters: {
    // get status of the player, if playing return true, else false
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
    currentSong: (state) => {
      if (state.sound.playing) {
        return state.currentSong;
      }

      return false;
    },
  },
  mutations: {
    // add new song to the queue in the player
    newSong: (state, payload) => {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    // update position of the player control bar
    updatePosition: (state) => {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}`;
    },
  },
  actions: {
    // action to add the new song to the player queue
    async newSong({ commit, state, dispatch }, payload) {
      // if there is a previous song playing, unload it. helps to reduce memory leaks!
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      // call newSong mutation
      commit('newSong', payload);

      // play the song
      state.sound.play();

      // everytime the song IS PLAYING, run requestionAnimationFrame
      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          // call progress action everytime the song is playing
          dispatch('progress');
        });
      });
    },
    // action to toggle the audio playing state
    async toggleAudio({ state }) {
      // if there is no song playing, return it
      if (!state.sound.playing) {
        return;
      }

      // if song is playing, pause -> if paused, play
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    // action to get the progress of player
    progress({ commit, state, dispatch }) {
      commit('updatePosition');

      // if song is playing, then keep updating the values
      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    // action to update the seek (click on the player control and move the value)
    updateSeek({ state, dispatch }, payload) {
      // if no song is playing, return it
      if (!state.sound.playing) {
        return;
      }

      // get x(horizontal) and the width from the player controller element
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      // this calculates the total window size - x(horizontal) position
      const clickX = payload.clientX - x;
      // calculates the percentage by dividing clickX / width (not *100 because we need to get the seconds)
      const percentage = clickX / width;
      // calculates the seconds by multiplying percentage * duration
      const seconds = state.sound.duration() * percentage;

      // update the positiion of the player
      state.sound.seek(seconds);

      // after changing once, keep the player going on updating values
      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
};
