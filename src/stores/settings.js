import { defineStore, acceptHMRUpdate } from 'pinia'

export const useSettings = defineStore({
  id: 'settings',
  state: () => ({
    optimistic: false,
    forceError: false,
    delay: 0,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot))
}
