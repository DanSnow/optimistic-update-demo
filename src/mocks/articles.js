export const articles = Array.from({ length: 5 }, (_, i) => ({
  __typename: 'Article',
  id: `${i + 1}`,
  title: `Article ${i + 1}`,
  featured: false,
}))
