<script setup lang="ts">
import type { Offer } from '~/composables/useOffers'
import { addFavorite, removeFavorite } from '~/composables/useFavorites'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  offer: Offer
  initialFavoriteId?: number | null
}>()

const { authUser } = useAuth()

const favoriteId = ref<number | null>(props.initialFavoriteId ?? null)
const isPending = ref(false)
const hasError = ref(false)

const isFavorite = computed(() => favoriteId.value !== null)

const toggleFavorite = async () => {
  if (isPending.value) return

  isPending.value = true
  hasError.value = false

  const previousId = favoriteId.value

  favoriteId.value = previousId !== null ? null : -1

  try {
    if (previousId !== null) {
      await removeFavorite(previousId)
    } else {
      const newFav = await addFavorite(authUser.value?.id as number, props.offer.id)
      favoriteId.value = newFav.id
    }
  } catch (err) {
    favoriteId.value = previousId
    hasError.value = true
    console.error('Erreur favoris:', err)
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <div class="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <button
      @click="toggleFavorite"
      :disabled="isPending"
      :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      class="absolute top-3 right-3 transition-all active:scale-125 disabled:opacity-50"
      :class="{ 'animate-pulse': isPending }"
    >
      <span
        class="text-xl transition-colors duration-200"
        :class="{
          'text-red-500': isFavorite && !hasError,
          'text-gray-300': !isFavorite && !hasError,
          'text-yellow-500': hasError
        }"
      >
        ♥
      </span>
    </button>

    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ offer.title }}</h3>
    <p class="text-gray-600 mb-1">{{ offer.company }}</p>
    <p class="text-gray-500 text-sm mb-2">{{ offer.location }}</p>
    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
      {{ offer.type }}
    </span>
  </div>
</template>
