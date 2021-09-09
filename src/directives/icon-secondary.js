export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value.icon} text-blue-600 text-xl`;

    if (binding.value.right) {
      iconClass += ' float-right';
    } else if (binding.value.left) {
      iconClass += ' float-left';
    }

    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
