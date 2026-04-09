<script setup lang="ts">
import type { Offer } from '~/composables/useOffers'

defineProps<{
  offer: Offer
}>()

const isFavorite = ref(false)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

</script>

<template>
  <div class="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <button
      @click="toggleFavorite"
      class="absolute top-3 right-3 text-xl"
    >
      {{ isFavorite ? '❤️' : '🤍' }}
    </button>
    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ offer.title }}</h3>
    <p class="text-gray-600 mb-1">{{ offer.company }}</p>
    <p class="text-gray-500 text-sm mb-2">{{ offer.location }}</p>
    <span
      class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
    >
      {{ offer.type }}
    </span>
  </div>
</template>
