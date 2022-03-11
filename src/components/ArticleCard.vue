<template>
  <div>
    id: {{ article.id }}
    <br />
    title: {{ article.title }}
    <br />
    featured: <input type="checkbox" v-model="featured" /> {{ article.featured }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useSettings } from '../stores/settings'
import { gql } from '@apollo/client/core'

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
</script>
