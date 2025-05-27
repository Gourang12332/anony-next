"use client"

import { signUpSchema } from '@/app/Schemas/signUpScheam';
import { verifySchema } from '@/app/Schemas/verifySchema';
import { ApiResponse } from '@/app/types/ApiResponse';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios , {AxiosError} from 'axios'
import { PathParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod"

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

export default function page() {
    const router = useRouter();
    const param = useParams();
    const{toast} = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver : zodResolver(verifySchema),
        defaultValues:{
            code : "",
        }
    })

    const onSubmit = async (data : z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`,{
                username : param.username,
                code : data.code
            })
            toast({
                title : "Success",
                description : response.data.message
            })

            router.replace('/sign-in');
        } catch (error) {
            const axioserror =  error as AxiosError<ApiResponse>
                  
                  toast({
                    title : 'sign up Failure',
                    description : axioserror.response?.data.message  ?? "error submitting form check your code gourang",
                    variant : "destructive"
                  })
        }
    }
  return (
    <div>
      <div>Do your styling</div>
        <div>
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder= "Verification Code" {...field}></Input>
                {/* filed can automatically updates the values once the submit button is pressed but if we want a continuous value then we can manage our individual username     and {...field} here we are passsing props at once*/}
                
              </FormControl>
                
              <FormMessage />
            </FormItem>
          )}
          /> 
         </form>
         </Form>
        </div>
    </div>
  )
}
