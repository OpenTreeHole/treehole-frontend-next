import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { Division } from '@/types'
import { InjectionKey } from 'vue'

type DState = {
  divisions: Division[]
}

export const store = createStore<DState>({
  state: {
    divisions: []
  },
  mutations: {
    setDivisions(state, payload: { divisions: Division[] }) {
      state.divisions = payload.divisions
    }
  }
})

export const key: InjectionKey<Store<DState>> = Symbol()

export const useStore = () => {
  return baseUseStore(key)
}
