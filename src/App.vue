<script setup>
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import ArticleCard from './components/ArticleCard.vue'

const { result } = useQuery(gql`
  query GetArticles {
    articles {
      id
      title
      featured
    }
  }
`)
</script>

<template>
  <div>
    <ArticleCard v-for="article of result?.articles || []" :key="article.id" :article="article" />
  </div>
</template>
