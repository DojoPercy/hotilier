'use client'

import { usePaystack } from '@makozi/paystack-react-pay'
import { PAYSTACK_CONFIG, ghsToKobo } from '@/lib/paystack'
import { useRouter } from 'next/navigation'
import { useState, ReactNode } from 'react'

interface PaystackPaymentProps {
  email: string
  amount: number
  onSuccess?: (reference: any) => void
  onClose?: () => void
  children: (props: { handlePayment: () => void; isLoading: boolean }) => ReactNode
}

export default function PaystackPayment({ email, amount, onSuccess, onClose, children }: PaystackPaymentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { initializePayment } = usePaystack({
    publicKey: PAYSTACK_CONFIG.publicKey,
    email,
    amount: ghsToKobo(amount),
    currency: 'GHS',
    onSuccess: (reference) => {
      console.log('Payment successful:', reference)
      setIsLoading(false)
      if (onSuccess) {
        onSuccess(reference)
      } else {
        router.push(`/subscribe/success?reference=${reference.reference}`)
      }
    },
    onClose: () => {
      console.log('Payment closed')
      setIsLoading(false)
      if (onClose) {
        onClose()
      }
    },
  })

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      initializePayment()
    } catch (error) {
      console.error('Payment initialization failed:', error)
      setIsLoading(false)
      alert('Payment initialization failed. Please try again.')
    }
  }

  return <>{children({ handlePayment, isLoading })}</>
}
