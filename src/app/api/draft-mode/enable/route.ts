import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {previewClient} from '@/sanity/lib'

export const {GET} = defineEnableDraftMode({
  client: previewClient,
})


