<script setup>
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import ArticleCard from './components/ArticleCard.vue'
import { useSettings } from './stores/settings'
import { computed } from 'vue'

const store = useSettings()

const { result } = useQuery(gql`
  query GetArticles {
    articles {
      id
      title
      featured
    }
  }
`)

const delay = computed({
  get: () => {
    return store.delay > 0
  },
  set: (val) => {
    store.delay = val ? 1500 : 0
  },
})
</script>

<template>
  <div class="container">
    <div class="tile is-ancestor">
      <ArticleCard v-for="article of result?.articles || []" :key="article.id" :article="article" />
      <div class="tile">
        <div class="box">
          <form>
            <div class="field">
              <label class="checkbox">
                <input type="checkbox" v-model="store.optimistic" />
                Optimistic Update
              </label>
            </div>
            <div class="field">
              <label class="checkbox">
                <input type="checkbox" v-model="store.forceError" />
                Force Error
              </label>
            </div>
            <div class="field">
              <label class="checkbox">
                <input type="checkbox" v-model="delay" />
                Delay
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
