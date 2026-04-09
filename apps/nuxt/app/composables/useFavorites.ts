export interface Favorite {
  id: number
  userId: number
  offerId: number
}

export interface FavoritesError {
  error: string
  status?: number
}

export async function getUserFavorites(userId: number): Promise<Favorite[]> {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const url = `${base.replace(/\/$/, '')}/favorites?userId=${userId}`

  try {
    const data = await $fetch<Favorite[]>(url)
    return Array.isArray(data) ? data : []
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : 'Erreur lors du chargement des favoris'),
      status: err?.statusCode,
    } as FavoritesError
  }
}

export async function addFavorite(userId: number, offerId: number): Promise<Favorite> {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const url = `${base.replace(/\/$/, '')}/favorites`
  const date = new Date();
  date.setTime(date.getTime() / 1000);

  try {
    return await $fetch<Favorite>(url, {
      method: 'POST',

      body: { userId, offerId ,date}
    })
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : 'Erreur lors de l\'ajout aux favoris'),
      status: err?.statusCode,
    } as FavoritesError
  }
}


export async function removeFavorite(favoriteId: number): Promise<void> {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const url = `${base.replace(/\/$/, '')}/favorites/${favoriteId}`

  try {
    await $fetch(url, {
      method: 'DELETE'
    })
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : 'Erreur lors de la suppression du favori'),
      status: err?.statusCode,
    } as FavoritesError
  }
}
