"use client"

import React from 'react'
import Link from 'next/link'  // 
import { useSession, signOut } from 'next-auth/react'   // usestate , usesession , they are the hooks and u need to make an instance of them always (variables)
import {User} from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'





export default function Navbar() {
    const {data : session} = useSession();
    const user:User = session?.user
    const router = useRouter();
  return (
    <div className='bg-blue-950 flex justify-around h-20 p-2 text-white'>
      <a href="#" className='m-5 font-sans font-extrabold text-2xl'>Mystery Message</a>
      <div className='m-5 font-extrabold'>
        {
            session ? (<>
            <p>Welcome {user.username}</p>
            {router.replace('/dashboard')}
            {/* <Button onClick={() => signOut()}>Logout</Button> */}
            </>) :
            (
                <>
                {/* <p className='text-red-700'>Not Autheticated</p> */}
                <Link href={'/sign-in'}>
                <Button >Login</Button>
                </Link>
                </>
            )
        }
      </div>
    </div>
  )
}
