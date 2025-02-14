'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/router'
import { signUpSchema } from '@/app/Schemas/signUpScheam'
import axios , {AxiosError} from 'axios'
import { ApiResponse } from '@/app/types/ApiResponse'


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




export default function page() {

  const {toast} = useToast()
  // const router = useRouter()
  const [username, setUsername] = useState(' ');
  const [usernameMessage, setUsernameMessage] = useState(' ');
  const [isCheckingUsername , setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const debouncedUsername = useDebounceValue(username,500);  // this will update after every 500 miliseconds of the username alters  and it will be done automatically
  const form  = useForm<z.infer<typeof signUpSchema>>({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
      username : " ",
      email :  " ",
      password : " "
    }
  })


  // checking username is there or not while typing
  useEffect(() =>{
    const usernamecheck = async () => {
      if(debouncedUsername){
        setIsCheckingUsername(true)   // right now checking is going on
        setUsernameMessage('')  // username message gotten be empty
        try {
        const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
        setUsernameMessage(response.data.message)

        console.log(response + "axios first time response in checking unique response")

        } catch (error) {
          const axioserror =  error as AxiosError<ApiResponse>
          setUsernameMessage(axioserror.response?.data.message ?? "Error fetching unique-username")

        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }

    usernamecheck()
  },[debouncedUsername])   // either of the try or catch block runs , usernamemessage would be set and ischecking going or not will be checked and in axios we do not require to jsonify the response;
  
  // onSubmit method is required because submitHandler method taked this method to print its form data, 
  // submitHandler method gains the form data. and pass it using onSubmit method


  // as on submit got presss data came here using handlesubmit of form object of react hook form
  const OnSubmit = async (data : z.infer<typeof signUpSchema>) =>{
    setIsSubmitting(true)


    console.log("onsubmitting data : " + data)
    try {
    const response  = await axios.post(`/api/sign-up`)
      toast({
        title : 'success',
        description : response.data.message,
      })

      // router.replace(`/verify/${username}`) 
      
      // we have passsed the username in route only with searchparams and code will be entered by the user on that page , so the username from the searchparams and code from the input field will be collected on frontedn only and then sent to the /verify-code route


    console.log("response for issubmitting is  : " + response)

    } catch (error) {
      const axioserror =  error as AxiosError<ApiResponse>
      
      toast({
        title : 'sign up Failure',
        description : axioserror.response?.data.message  ?? "error submitting form check your code gourang",
        variant : "destructive"
      })
    }

    finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div>
       <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className='space-y-6'>
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e) =>{
                  field.onChange(e)   // here field will automatically updates its username fields and left all fields

                  setUsername(e.target.value)
                }} />
                {/* filed can automatically updates the values once the submit button is pressed but if we want a continuous value then we can manage our individual username     and {...field} here we are passsing props at once*/}
                
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}  />  
               
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                <Input type='password' placeholder="username" {...field}  />
                
              </FormControl>
              <FormDescription>
                This is your public display pass.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
             <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? <>
                <Loader2 className = "mr-2 h-4 w-4">Please wait</Loader2>
                </> : 'sign-up'
              }
             </Button>
         </form>
         <div><p>
          Already a memeber ? 
          <Link href={`/sign-in`}>SignIn</Link>
          </p></div>
         </Form>
    </div>
  )
}
