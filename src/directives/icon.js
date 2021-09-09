export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-blue-600 text-xl`;

    // if (binding.arg === 'full') {
    //   iconClass = binding.value;
    // }

    if (binding.modifiers.right) {
      iconClass += ' float-right';
    } else if (binding.modifiers.left) {
      iconClass += ' float-left';
    }

    // eslint-disable-next-line no-param-reassign
    el.innerHTML = `<i class="${iconClass}"></i>`;
  },
};
