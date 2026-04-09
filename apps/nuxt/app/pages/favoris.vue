<script setup lang="ts">
import type {Offer} from '~/composables/useOffers'
import {OfferCard} from '#components'
import {useAuth} from '~/composables/useAuth'

const {authUser} = useAuth()
const {data: favorites} = await useAsyncData<Favorite[]>(
  'userFavorites',
  () => getUserFavorites(authUser.value?.id as number)
)

const {data: offers} = await useAsyncData<Offer[]>('offers', async () => {
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

if (!authUser.value) {
  navigateTo('/login')
}
</script>

<template>
  <div class="p-4">
    <h1 class="title">Mes favoris</h1>

    <div v-if="favoriteOffers.length == 0 ">
      <p>Aucun Favoris</p>
    </div>

    <div v-else class="offers">
      <OfferCard
        v-for="offer in favoriteOffers"
        :key="offer.id"
        :offer="offer"
      />
    </div>
  </div>
</template>

<style>
.title {
  font-size: 60px;
}

.offers {
  display: grid;
}
</style>
