import { graphql } from 'msw'
import { articles } from '../articles'
import { pinia } from '../../pinia'
import { useSettings } from '../../stores/settings'

export const handler = graphql.query('GetArticles', (req, res, ctx) => {
  const store = useSettings(pinia)

  const delay = ctx.delay(store.delay)

  if (store.forceError) {
    return res(delay, ctx.errors([{ message: 'Error' }]))
  }

  return res(
    delay,
    ctx.data({
      articles,
    })
  )
})
