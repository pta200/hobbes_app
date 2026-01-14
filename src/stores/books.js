import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './users.js'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_ROOT_URL || ''

export const useBookStore = defineStore('books', () => {
  const items = ref([])
  const total = ref(0)
  const loading = ref(false)
  const userStore = useUserStore()

  async function getBooks(offset = 0, limit = 100) {
    loading.value = true
    if (items.value.length == 0) {
      try {
        const response = await axios.get(
          API_URL + `/books?offset=${offset}&limit=${limit}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.authToken}`,
            },
          },
        )

        items.value = response.data.rows
        total.value = response.data.total
        return response
      } catch (error) {
        items.value = [
          { isbn: 1, book_name: 'To Kill a Mockingbird', author: 'Harper Lee', book_type: 'Fiction',},
          { isbn: 2, book_name: '1984', author: 'George Orwell', book_type: 'Dystopian'},
        ]
        console.error('Error during request:', error)
        if (axios.isAxiosError(error) && error?.response) {
          return error.response
        }
        return error.message
      }
    }
    loading.value = false
  }

  async function addBook(payload) {
    try {
      const response = await axios.post(API_URL + '/books', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response.data)
      items.value.push(response.data)
      return response
    } catch (error) {
      console.error('Error during POST request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    }
  }

  async function editBook(bookId, payload) {
    try {
      const response = await axios.put(API_URL + `/books/${bookId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response)
      const index = items.value.findIndex((book) => book.book_id === bookId)
      items.value.splice(index, 1, response.data)
      return response
    } catch (error) {
      console.error('Error during POST request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    }
  }

  async function deleteBook(bookId) {
    try {
      const response = await axios.delete(API_URL + `/books/${bookId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.authToken}`,
        },
      })
      console.log('Response:', response)
      const index = items.value.findIndex((book) => book.book_id === bookId)
      items.value.splice(index, 1)
      return response
    } catch (error) {
      console.error('Error during POST request:', error)
      if (axios.isAxiosError(error) && error?.response) {
        return error.response
      }
      return error.message
    }
  }

  return { items, total, getBooks, addBook, editBook, deleteBook }
})
