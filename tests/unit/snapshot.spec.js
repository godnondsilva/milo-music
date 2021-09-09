import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('Snpashots SongItem.vue', () => {
  it('renders correctly', () => {
    const song = {
      docID: 'abc',
      modified_name: 'test',
      display_name: '',
      comment_count: 5,
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
