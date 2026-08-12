import type { TrackedRoute } from '../types'
import { useLocalStorage } from './useLocalStorage'

export function useWatchlist() {
  const [routes, setRoutes] = useLocalStorage<TrackedRoute[]>('sf.watchlist', [])

  const addRoute = (origin: string, destination: string, targetPrice: number) => {
    const id = `${origin}-${destination}`.toUpperCase()
    setRoutes((prev) => {
      if (prev.some((r) => r.id === id)) return prev
      return [...prev, { id, origin: origin.toUpperCase(), destination: destination.toUpperCase(), targetPrice, createdAt: new Date().toISOString() }]
    })
  }

  const removeRoute = (id: string) => setRoutes((prev) => prev.filter((r) => r.id !== id))

  return { routes, addRoute, removeRoute }
}
