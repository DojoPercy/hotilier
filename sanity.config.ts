import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import schemaTypes from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Hotelier Africa',

  projectId: process.env.SANITY_PROJECT_ID || '5dmr2qcf',
  dataset: 'production',
  basePath: '/admin',
  apiVersion: '2024-03-18',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
