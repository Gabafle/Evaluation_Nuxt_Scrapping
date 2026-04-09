<script setup lang="ts">
import type { Offer } from '~/composables/useOffers'
import { getUserFavorites, type Favorite } from '~/composables/useFavorites'
import { OfferCard } from '#components'
import { useAuth } from '~/composables/useAuth'

const { authUser } = useAuth()

if (!authUser.value) {
  navigateTo('/login')
}

const { data: favorites } = await useAsyncData<Favorite[]>(
  'userFavorites',
  () => getUserFavorites(authUser.value?.id as number)
)

const { data: offers } = await useAsyncData<Offer[]>('offers', async () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const url = `${base.replace(/\/$/, '')}/offers`
  return $fetch<Offer[]>(url)
})

const favoriteOffers = computed(() => {
  if (!favorites.value || !offers.value) return []
  const favoriteIds = new Set(favorites.value.map(f => f.offerId))
  return offers.value.filter(offer => favoriteIds.has(offer.id))
})

const favoritesMap = computed(() => {
  if (!favorites.value) return {} as Record<number, number>
  return Object.fromEntries(favorites.value.map(f => [f.offerId, f.id]))
})
</script>

<template>
  <div class="p-4">
    <h1>Mes favoris</h1>
    <div class="grid">
      <OfferCard
        v-for="offer in favoriteOffers"
        :key="offer.id"
        :offer="offer"
        :initial-favorite-id="favoritesMap[offer.id] ?? null"
      />
    </div>
  </div>
</template>
