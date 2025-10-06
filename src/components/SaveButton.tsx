'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createSavedItem, getSessionEmail, isItemSaved } from '@/app/actions'

type SaveButtonProps = {
	email?: string
	contentId: string
	className?: string
	initialSaved?: boolean
}

const SaveButton: React.FC<SaveButtonProps> = ({ email, contentId, className, initialSaved }) => {
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(Boolean(initialSaved))
	const [error, setError] = useState<string | null>(null)
  const [derivedEmail, setDerivedEmail] = useState<string | undefined>(email)

  useEffect(() => {
    setDerivedEmail(email)
  }, [email])

  useEffect(() => {
    const fetchEmail = async () => {
      if (derivedEmail) return
      try {
        const emailFromSession = await getSessionEmail()
		console.log('email', emailFromSession)
        if (emailFromSession) setDerivedEmail(emailFromSession)
      } catch {}
    }
    fetchEmail()
  }, [derivedEmail])

  useEffect(() => {
    const checkSaved = async () => {
      if (!derivedEmail) return
      try {
        const exists = await isItemSaved({ email: derivedEmail, contentId })
        if (exists) setSaved(true)
      } catch {}
    }
    checkSaved()
  }, [derivedEmail, contentId])

	const onClick = useCallback(async () => {
		if (saving) return
		setSaving(true)
		setError(null)
		try {
			if (!derivedEmail) {
				setError('Please sign in to save items')
				return
			}
			const res = await createSavedItem({ email: derivedEmail, contentId })
			if (res?.status === 'created' || res?.status === 'exists') {
				setSaved(true)
			}
		} catch (e) {
            console.error(e);
			setError('Could not save item')
		} finally {
			setSaving(false)
		}
	}, [saving, derivedEmail, contentId])

	return (
		<button
			type="button"
			aria-label={saved ? 'Saved' : 'Save'}
			disabled={saving}
			onClick={onClick}
			className={className}
		>
			{saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
			<span className="sr-only">{saved ? 'Saved' : 'Save'}</span>
			{error && (
				<span className="ml-2 text-red-500 text-sm">{error}</span>
			)}
		</button>
	)
}

export default SaveButton


