'use server'
import {draftMode} from 'next/headers'
import { saveItemForUserEmail, client } from '@/sanity/lib'
import { auth0 } from '@/lib/auth0'

export async function disableDraftMode() {
  const disable = (await draftMode()).disable()
  const delay = new Promise((resolve) => setTimeout(resolve, 1000))
  await Promise.allSettled([disable, delay])
}


export async function createSavedItem(params: { email: string; contentId: string }) {
	const { email, contentId } = params
	if (!email || !contentId) {
		throw new Error('email and contentId are required')
	}
	return saveItemForUserEmail(email, contentId)
}

export async function getSessionEmail(): Promise<string | null> {
	const session = await auth0.getSession()
	return session?.user?.email ?? null
}

export async function isItemSaved(params: { email: string; contentId: string }): Promise<boolean> {
	const { email, contentId } = params
	if (!email || !contentId) return false
	const existingSavedId = await client.fetch<string | null>(
		`*[_type == "savedItem" && user->email == $email && content._ref == $contentId][0]._id`,
		{ email, contentId }
	)
	return Boolean(existingSavedId)
}


