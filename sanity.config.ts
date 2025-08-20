import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import schemaTypes from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Energy Nexus',

  projectId: 'zgs7rdoe',
  dataset: 'production',
  basePath: '/admin',
  apiVersion: '2024-03-18',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
