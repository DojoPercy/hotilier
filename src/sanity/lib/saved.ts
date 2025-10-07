import { createClient } from 'next-sanity'

// A token-authenticated client for write operations
export const writeClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zgs7rdoe',
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2024-03-18',
	useCdn: false,
	token: process.env.SANITY_CREATE,
})

type SaveResult = {
	status: 'created' | 'exists'
	savedItemId: string
}

/**
 * Create a savedItem linking a user (by email) to a content document (by _id).
 * Ensures idempotency: if it already exists, returns existing document id.
 */
export async function saveItemForUserEmail(email: string, contentId: string): Promise<SaveResult> {
	if (!process.env.SANITY_API_TOKEN) {
		throw new Error('SANITY_API_TOKEN is not configured')
	}

	// Resolve user id by email
	const userId = await writeClient.fetch<string | null>(
		`*[_type == "user" && email == $email][0]._id`,
		{ email }
	)
	if (!userId) {
		throw new Error('User not found for the provided email')
	}

	// Optionally ensure content exists
	const existingContentId = await writeClient.fetch<string | null>(
		`*[_id == $contentId][0]._id`,
		{ contentId }
	)
	if (!existingContentId) {
		throw new Error('Content not found for the provided id')
	}

	// Check for existing savedItem
	const existingSavedId = await writeClient.fetch<string | null>(
		`*[_type == "savedItem" && user._ref == $userId && content._ref == $contentId][0]._id`,
		{ userId, contentId }
	)
	if (existingSavedId) {
		return { status: 'exists', savedItemId: existingSavedId }
	}

	// Create savedItem
	const created = await writeClient.create({
		_type: 'savedItem',
		user: { _type: 'reference', _ref: userId },
		content: { _type: 'reference', _ref: contentId },
		createdAt: new Date().toISOString(),
	})

	return { status: 'created', savedItemId: created._id as string }
}


