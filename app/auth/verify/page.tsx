import VerifyAccountForm from '@/components/auth/verify'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<p>Loading....</p>}>
      <VerifyAccountForm />
    </Suspense>
  )
}

export default page
