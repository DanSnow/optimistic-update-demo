<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import ArticleCard from './components/ArticleCard.vue'
import { useSettings } from './stores/settings'
import { computed, watch } from 'vue'
import Icon from './components/Icon.vue'

const store = useSettings()

const GetArticles = gql`
  query GetArticles {
    articles {
      id
      title
      featured
    }
  }
`

const { result } = useQuery(GetArticles)

const delay = computed({
  get: () => {
    return store.delay > 0
  },
  set: (val) => {
    store.delay = val ? 1500 : 0
  },
})

const stop = watch(result, (res) => {
  if (res) {
    // once data is loaded, start delay the API call
    delay.value = true
    stop()
  }
})

const { mutate } = useMutation(
  gql`
    mutation CreateArticle {
      createArticle {
        id
        title
        featured
      }
    }
  `,
  {
    // refetchQueries: [GetArticles],
    update: (cache, { data: { createArticle } }) => {
      const { articles } = cache.readQuery({ query: GetArticles })
      cache.writeQuery({
        query: GetArticles,
        data: {
          articles: [...articles, createArticle],
        },
      })
    },
  }
)

async function addArticle() {
  const id = (result.value.articles?.length ?? 0) + 1
  const title = `Article ${id}`
  const optimisticResponse = store.optimistic
    ? {
        __typename: 'Mutation',
        createArticle: {
          __typename: 'Article',
          id: 'temp',
          title,
          featured: false,
        },
      }
    : undefined

  await mutate(undefined, {
    optimisticResponse,
  })
}
</script>

<template>
  <div class="container">
    <div class="is-flex">
      <div class="tile is-ancestor">
        <div class="tile is-parent" v-for="article of result?.articles || []" :key="article.id">
          <ArticleCard :article="article" />
        </div>
      </div>
      <div>
        <div class="box">
          <form>
            <div>
              <button class="button" type="button" @click="addArticle">
                <span class="icon is-small">
                  <Icon icon="plus" />
                </span>
                <span>Add Article</span>
              </button>
            </div>
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
