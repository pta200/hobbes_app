<script setup>
import ProfileView from './ProfileView.vue'
import { useuiStateStore } from '../stores/uiState.js'
import logo from '@/assets/logo.svg'

const uiStateStore = useuiStateStore()
</script>

<template>
  <v-app-bar :class="[uiStateStore.navTheme ? 'appBarLight' : 'appBarDark']" :elevation="0">
    <router-link to="/">
      <v-img class="mx-2" contain :src="logo" width="113" height="44" style="cursor: pointer" />
    </router-link>
    <div class="line-1"></div>
    <v-toolbar-title class="applicationName">
      Hobbes App Lab
      <!-- <div class="small-label">DETAILS</div> -->
    </v-toolbar-title>
    <ProfileView />
  </v-app-bar>
</template>

<style>
@import '../assets/base.css';

.appBarLight {
  background-image: linear-gradient(to right, #c7b9e7, #4314af) !important;
  border: 1px solid #000000;
}

.appBarDark {
  background-image: linear-gradient(to right, #a598c3, #4314af) !important;
  border: 1px solid #000000;
}
</style>
