'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { SignInSchema } from '@/app/Schemas/SignInSchema'

export default function page() {

  const {toast} = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);


  
  const form  = useForm<z.infer<typeof SignInSchema>>({
    resolver : zodResolver(SignInSchema),
    defaultValues : {
      identifier :  "",
      password : ""
    }
  })
  
  

  // as on submit got presss data came here using handlesubmit of form object of react hook form
  const OnSubmit = async (data : z.infer<typeof SignInSchema>) =>{
    setIsSubmitting(true)


    console.log("onsubmitting data : " + data)
    const result = await signIn('credentials',{
        redirect : false,
        identifier : data.identifier,
        password : data.password
    })

    if(result?.error){
        toast({
        title : "Login Failed",
        description : result.error.toString(),
        variant : "destructive"
        })
    } 
    if(result?.url){
        router.replace('dashboard')
    }
    }
    
  


  return (
    <div>
       <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className='space-y-6'>
          

         <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email/username" {...field}  />  
               
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="password" {...field}  />
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
             <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? <>
                <Loader2 className = "mr-2 h-4 w-4">Please wait</Loader2>
                </> : 'sign-in'
              }
             </Button>
         </form>
         
         </Form>
    </div>
  )
}
