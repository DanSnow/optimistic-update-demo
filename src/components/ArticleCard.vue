<template>
  <div class="tile">
    <section class="card">
      <header class="card-header">
        <p class="card-header-title">
          <strong class="mr-1">{{ article.id }}: </strong>
          {{ article.title }}
        </p>
      </header>
      <footer class="card-footer is-flex is-justify-content-center is-align-items-center">
        <button class="button" @click="featured = !featured">
          <span class="icon">
            <Icon icon="star" :type="featured ? 'fas' : 'far'" />
          </span>
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useSettings } from '../stores/settings'
import { gql } from '@apollo/client/core'
import Icon from './Icon.vue'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const store = useSettings()

const { mutate } = useMutation(gql`
  mutation UpdateArticle($id: ID!, $featured: Boolean!) {
    updateArticle(id: $id, featured: $featured) {
      id
      title
      featured
    }
  }
`)

const featured = computed({
  get() {
    return props.article.featured || false
  },
  set(val) {
    const optimisticResponse = store.optimistic
      ? {
          __typename: 'Mutation',
          updateArticle: {
            __typename: 'Article',
            id: props.article.id,
            title: props.article.title,
            featured: val,
          },
        }
      : undefined

    mutate(
      {
        id: props.article.id,
        featured: val,
      },
      {
        optimisticResponse,
      }
    )
  },
})

// Manually optimistic update
// const tempFeatured = ref()

// const featured = computed({
//   get() {
//     return tempFeatured.value ?? props.article.featured ?? false
//   },
//   async set(val) {
//     tempFeatured.value = val

//     await mutate({
//       id: props.article.id,
//       featured: val,
//     })

//     tempFeatured.value = undefined
//   },
// })
</script>
