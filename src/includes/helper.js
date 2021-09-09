export default {
  // formatTime takes seconds as parameter and converts it to the form 00:00
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.round((time - minutes * 60) || 0);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  },
};
