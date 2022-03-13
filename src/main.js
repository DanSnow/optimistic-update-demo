import 'bulma/css/bulma.css'
import './fontawesome'

import { createApp } from 'vue'
import App from './App.vue'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { worker } from './mocks/browser'
import { pinia } from './pinia'

worker.start()

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
})

createApp(App).provide(DefaultApolloClient, client).use(pinia).mount('#app')
