import { graphql } from 'msw'
import { articles } from '../articles'
import { pinia } from '../../pinia'
import { useSettings } from '../../stores/settings'

export const handler = graphql.mutation('UpdateArticle', (req, res, ctx) => {
  const store = useSettings(pinia)

  const { id, featured } = req.variables
  const article = articles.find((article) => article.id === id)
  article.featured = featured

  const delay = ctx.delay(store.delay)

  if (store.forceError) {
    return res(delay, ctx.errors([{ message: 'Error' }]))
  }

  return res(
    delay,
    ctx.data({
      updateArticle: article,
    })
  )
})
