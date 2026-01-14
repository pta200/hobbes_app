<script>
import TitleView from './views/TitleView.vue'
import NavigationView from './views/NavigationView.vue'
import { useuiStateStore } from './stores/uiState.js'

import { ref } from 'vue'
export default {
  name: 'App',

  components: {
    TitleView,
    NavigationView,
  },
  setup() {
    const theme = ref('lightTheme')
    const uiStateStore = useuiStateStore()

    return {
      theme,
      uiStateStore,
    }
  },
}
</script>

<template>
  <v-app :theme="uiStateStore.themestate" class="bg-appBg">
    <TitleView />
    <NavigationView />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
