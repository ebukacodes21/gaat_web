import { routes } from '@/constants'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
         <Link href={routes.HOME} className="flex items-center gap-2 relative z-10 cursor-pointer">
          <span className="h-6 w-6 rounded bg-[#D61F28] flex items-center justify-center font-black text-xs text-white">
            G
          </span>
          <span className="font-bold tracking-tight text-white text-lg">
            GAAT Investment
          </span>
        </Link>
  )
}

export default Logo
