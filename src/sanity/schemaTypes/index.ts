import { type SchemaTypeDefinition } from 'sanity'
import order from './order'
import products from './products'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [order, products],
}
