import { defineStore } from 'pinia'
import _ from 'lodash'

export const useuiStateStore = defineStore('uiStateStore', {
  state: () => ({
    snackbar: false,
    timeout: 5000,
    toggle: false,
    username: '',
    themestate: localStorage.getItem('theme') || 'lightTheme',
    currentTheme: '',
    navTheme: true,
  }),
  actions: {
    snackbarState() {
      this.snackbar = true
      this.timeout = 8000
    },
    toggleState() {
      this.toggle = !this.toggle
    },
    toggleTheme() {
      if (this.themestate === 'darkTheme') {
        localStorage.setItem('theme', 'darkTheme')
        this.navTheme = false
      } else {
        localStorage.setItem('theme', 'lightTheme')
        this.navTheme = true
      }
      this.currentTheme = _.capitalize(localStorage.theme.split('T')[0])
    },
    checkTheme() {
      if (localStorage.getItem('theme')) {
        this.themestate = localStorage.getItem('theme')
        this.currentTheme = _.capitalize(localStorage.theme.split('T')[0])
        if (localStorage.getItem('theme') === 'darkTheme') {
          this.navTheme = false
        } else if (localStorage.getItem('theme') === 'lightTheme') {
          this.navTheme = true
        }
      } else {
        this.themestate = 'lightTheme'
        this.currentTheme = 'Light'
      }
    },
  },
})
