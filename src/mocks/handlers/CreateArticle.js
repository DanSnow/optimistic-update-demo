import { graphql } from 'msw'
import { articles } from '../articles'
import { pinia } from '../../pinia'
import { useSettings } from '../../stores/settings'

export const handler = graphql.mutation('CreateArticle', (req, res, ctx) => {
  const store = useSettings(pinia)

  const id = articles.length + 1
  const article = {
    __typename: 'Article',
    id: `${id}`,
    title: `Article ${id}`,
    featured: false,
  }
  articles.push(article)

  const delay = ctx.delay(store.delay)

  if (store.forceError) {
    return res(delay, ctx.errors([{ message: 'Error' }]))
  }

  return res(
    delay,
    ctx.data({
      createArticle: article,
    })
  )
})
