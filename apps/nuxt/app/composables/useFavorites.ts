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


