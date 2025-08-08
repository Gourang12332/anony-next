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

export default function Page() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
  <div className="text-2xl font-semibold text-gray-800 mb-4">Enter Verification Code</div>
  <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Verification Code"
                  {...field}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Submit
        </button>
      </form>
    </Form>
  </div>
</div>

  )
}
