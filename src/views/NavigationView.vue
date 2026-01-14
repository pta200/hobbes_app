<script>
import { useUserStore } from '../stores/users.js'
import { navigations } from '../navConfig'

export default {
  setup() {
    const userStore = useUserStore()
    return {
      userStore,
      navigations,
    }
  },
}
</script>

<template>
  <v-system-bar window v-if="userStore.authToken" class="linkOutter bg-linkBg border-linkBorder">
    <div class="linkClass">
      <div v-for="nav in navigations" :key="nav.title">
        <router-link class="link text-linkText" v-if="nav.type == 'link'" :to="nav.route">{{
          nav.title
        }}</router-link>

        <v-menu v-if="nav.type == 'menu'">
          <template v-slot:activator="{ props }">
            <v-btn class="menuBtn link text-linkText" v-bind="props">
              {{ nav.title }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(menuItem, index) in nav.routes" :key="index" :value="index">
              <router-link class="link text-linkText" :to="menuItem.route">{{
                menuItem.title
              }}</router-link>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-spacer></v-spacer>
  </v-system-bar>
</template>

<style scoped>
.linkOutter {
  border-bottom: 0.5px solid #dce1e1;
  opacity: 90%;
}
.linkClass {
  display: flex;
  align-items: center;
}

.linkClass * {
  margin-right: 30px;
  display: flex;
}

.link {
  font-weight: bold;
  text-decoration: none;
  font-family: 'Roboto Regular', sans-serif;
  font-size: 14px;
}

.menuBtn {
  margin: 0;
  padding: 0;
}
</style>
