'use server'
import {draftMode} from 'next/headers'
import { saveItemForUserEmail, client, writeClient } from '@/sanity/lib'
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

export async function submitContractInquiry(params: {
	firstName: string
	lastName: string
	companyName: string
	workEmail: string
	country?: string
	message?: string
	agreeToCommunications: boolean
}) {
	try {
		const { firstName, lastName, companyName, workEmail, country, message, agreeToCommunications } = params

		// Validate required fields
		if (!firstName || !lastName || !companyName || !workEmail) {
			throw new Error('Missing required fields')
		}

		// Save to Sanity using write client
		const inquiry = await client.create({
			_type: 'contractInquiry',
			firstName,
			lastName,
			companyName,
			workEmail,
			country: country || undefined,
			message: message || undefined,
			agreeToCommunications,
			status: 'new',
			submittedAt: new Date().toISOString(),
		})

		// Send email notification (optional - uncomment when email service is configured)
		// See src/lib/email.ts for setup instructions
		console.log('New contract inquiry:', {
			id: inquiry._id,
			name: `${firstName} ${lastName}`,
			company: companyName,
			email: workEmail,
		})

		// TODO: Uncomment when email service is configured
		// import { sendContractInquiryEmail } from '@/lib/email'
		// await sendContractInquiryEmail({
		//   firstName,
		//   lastName,
		//   companyName,
		//   workEmail,
		//   country,
		//   message,
		//   agreeToCommunications,
		//   submittedAt: inquiry.submittedAt,
		// })

		return { success: true, id: inquiry._id }
	} catch (error) {
		console.error('Error submitting contract inquiry:', error)
		throw error
	}
}


