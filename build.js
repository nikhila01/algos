import collections from 'metalsmith-collections'
import drafts from 'metalsmith-drafts'
import layouts from 'metalsmith-layouts'
import markdown from 'metalsmith-markdown'
import Metalsmith from 'metalsmith'
import permalinks from 'metalsmith-permalinks'

const BUILD_DESTINATION = '/Users/ozan/tmp/algos-book-dev-build'

const sections = [
  ['analysis', 'Analysis'],
  ['stacks', 'Stacks'],
  ['queues', 'Queues'],
  ['deques', 'Deques'],
  ['lists', 'Lists'],
  ['recursion', 'Recursion'],
  ['searching', 'Searching'],
  ['trees', 'Trees'],
  ['graphs', 'Graphs'],
]
const collectionConfig = new Map(
  sections.map(([label, name]) => [label, {
    sortBy: 'position',
    metadata: { name: name },
  }])
)

const byPosition = (a, b) => a.position - b.position

const generateTableOfContents = (files, metalsmith) => {
  const metadata = metalsmith.metadata()
  metadata['tableOfContents'] = sections.map(([label, name]) => {
    return {
      sectionName: name,
      collection: (metadata[label] || []).sort(byPosition),
    }
  })
}

console.log(`Building to ${BUILD_DESTINATION} ..`)

Metalsmith(__dirname)
.source('book')
.destination(BUILD_DESTINATION)
.use(drafts())
.use(collections(collectionConfig))
.use(markdown({ tables: true }))
.use(permalinks())
.use(generateTableOfContents)
.use(layouts({ engine: 'handlebars' }))
.build(err => {
  console.log('Built')
  if (err) { throw err }
})
