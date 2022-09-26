<template>
  <!-- Header -->
  <header id="header" class="bg-black">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold text-2xl mr-4" exact-active-class="no-active" :to="{ name: 'home' }">
        <!-- Milo Music -->
        <img id="headerlogo" class="mt-1" src="../assets/logo.png" />
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="hover:text-blue-400 px-2 text-white" :to="{ name: 'manage' }">
                Manage
              </router-link>
            </li>
            <li>
              <a class="hover:text-blue-400 px-2 text-white" href="#" @click.prevent="signOut">Logout</a>
            </li>
          </template>
        </ul>

        <select class="bg-gray-200 outline-none rounded-sm mt-1 p-1 ml-auto" @change="changeLocale">
          <option :value="locale.lang" class="px-2" v-for="locale in locales" :key="locale.type">
            {{ locale.lang }}
          </option>
        </select>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {
      locales: [
        {
          type: 'en',
          lang: 'English',
        },
        {
          type: 'ja',
          lang: 'Japanese',
        },
      ],
      selectedLocale: '',
    };
  },
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
    }),
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    signOut() {
      this.$store.dispatch('signOut');
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'ja' ? 'en' : 'ja';
    },
    // toggleAuthModal() {
    //   this.$store.commit('toggleAuthModal');
    //   console.log(this.$store.state.authModalShow);
    // },
  },
};
</script>
