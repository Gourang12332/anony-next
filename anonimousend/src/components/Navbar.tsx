"use client"

import React from 'react'
import Link from 'next/link'  // 
import { useSession, signOut } from 'next-auth/react'   // usestate , usesession , they are the hooks and u need to make an instance of them always (variables)
import {User} from 'next-auth'
import { Button } from './ui/button'





export default function Navbar() {
    const {data : session} = useSession();
    const user:User = session?.user
  return (
    <div>
      <a href="#">Mystery Message</a>
      <div>
        {
            session ? (<>
            <p>Welcome {user.username}</p>
            <Button onClick={() => signOut()}>Logout</Button>
            </>) :
            (
                <>
                <p>Not Autheticated</p>
                <Link href={'/sign-in'}>
                <Button>Login</Button>
                </Link>
                </>
            )
        }
      </div>
    </div>
  )
}
