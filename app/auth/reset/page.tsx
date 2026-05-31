import ResetPasswordForm from '@/components/auth/reset'
import { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>} >
      <ResetPasswordForm />
    </Suspense>
  )
}

export default page
