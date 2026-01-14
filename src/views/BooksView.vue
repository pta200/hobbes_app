<template>
  <v-card-text>
    <v-alert v-if="deleteError" @click="clearError" type="error" class="mt-4">
      {{ errorMessage }}
    </v-alert>
  </v-card-text>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :items="bookStore.items" :loading="bookStore.loading" no-data-text="No books on record">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-archive-plus" size="x-small" start></v-icon>
            Book Store
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-book-edit"
            rounded="lg"
            text="Add a Book"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.title`]="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-archive" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item.book_id)"
          ></v-icon>

          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.book_id)"
          ></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn
          prepend-icon="mdi-backup-restore"
          rounded="lg"
          text="Reset data"
          variant="text"
          border
          @click="reset"
        ></v-btn>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="600">
    <v-card-text>
      <v-alert v-if="apiError" type="error" class="mt-4">
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    <v-card :title="`${isEditing ? 'Edit' : 'Add'} a Book`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="formModel.book_name" label="Name"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formModel.book_type"
              :items="['biography', 'sci-fi', 'cooking']"
              label="Type"
            ></v-select>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field v-model="formModel.isbn" label="URL"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, shallowRef, toRef } from 'vue'
import { useBookStore } from '@/stores/books'
import { useRouter } from 'vue-router'

const router = useRouter()

function createNewRecord() {
  return {
    book_name: '',
    book_type: '',
    isbn: '',
  }
}

const bookStore = useBookStore()

const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.book_id)
const apiError = ref(false)
const deleteError = ref(false)
const errorMessage = ref('')

const headers = [
  { title: 'Name', key: 'book_name', align: 'start' },
  { title: 'Type', key: 'book_type' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

onMounted(() => {
  reset()
})

function add() {
  formModel.value = createNewRecord()
  dialog.value = true
  apiError.value = false
  deleteError.value = false
  errorMessage.value = ''
}

function edit(id) {
  apiError.value = false
  deleteError.value = false
  errorMessage.value = ''

  const found = bookStore.items.find((rep) => rep.book_id === id)

  formModel.value = {
    book_id: found.book_id,
    book_name: found.book_name,
    book_type: found.book_type,
    isbn: found.isbn,
  }

  dialog.value = true
}

async function remove(repId) {
  const response = await bookStore.deleteBook(repId)
  if (response?.status == 204) {
    console.log('delete success')
  } else if (response?.status == 401) {
    router.push('/login')
  } else {
    if (response?.data) {
      errorMessage.value = response.data?.detail ? response.data.detail : response.data
    } else {
      errorMessage.value = response
    }
    deleteError.value = true
  }
}

async function save() {
  if (isEditing.value) {
    const response = await bookStore.editBook(formModel.value.book_id, {
      rep_name: formModel.value.book_name,
      rep_type: formModel.value.book_type,
      url: formModel.value.isbn,
    })

    if (response?.status == 200) {
      dialog.value = false
    } else if (response?.status == 401) {
      router.push('/login')
    } else {
      if (response?.data) {
        errorMessage.value = response.data?.detail ? response.data.detail : response.data
      } else {
        errorMessage.value = response
      }
      apiError.value = true
    }
  } else {
    const response = await bookStore.addBook({
      rep_name: formModel.value.book_name,
      rep_type: formModel.value.book_type,
      url: formModel.value.isbn,
    })

    if (response?.status == 201) {
      dialog.value = false
    } else if (response?.status == 401) {
      router.push('/login')
    } else {
      if (response?.data) {
        errorMessage.value = response.data?.detail ? response.data.detail : response.data
      } else {
        errorMessage.value = response
      }
      apiError.value = true
    }
  }
}

async function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
  await bookStore.getBooks()
}

function clearError() {
  deleteError.value = false
  errorMessage.value = ''
}
</script>
