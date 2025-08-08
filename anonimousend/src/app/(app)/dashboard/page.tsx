"use client"

import { Message } from '@/app/models/User'
import { AcceptSchema } from '@/app/Schemas/acceptSchema';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import { User } from 'next-auth';
import { Switch } from '@/components/ui/switch';
import MessageCard from '@/components/MessageCard';
import { Controller } from 'react-hook-form';

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MyResponse {
  message?: Message[]; // Replace `Message[]` with your actual type
}

export default function Page() {
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState(false)
  const[isSwitchLoading , setisSwitchLoading] = useState(false)
  const router = useRouter();

  const {toast} = useToast();
 // this is to deltet the message from the users account
  const handleDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message) => {
      return message._id !== messageId;
    }))
  }

  // this is to get the session from backend ,which is containing info of authorised user
  const {data : session} = useSession();

  // to validata react hook form and to access to watch on switch state 
  const form = useForm({
    resolver : zodResolver(AcceptSchema),
    defaultValues : {
      acceptMessages : false
    }
  })
  // so form here is an object containing register, watch and setvalue , we are destructuring to use them out of the form

  const {register,watch,reset,setValue} = form;

  // accepting messages is the watch state , which confirm that the user is accepitng or declining message
  const acceptMessages = watch('acceptMessages') // a big game here , watching the field with acceptmessages

  
  const fetchAcceptMessage = useCallback(async () =>{
    setisSwitchLoading(true);

    try{
      const response = await axios.get('/api/acceptmessages')
      reset({'acceptMessages': response?.data.isAcceptingmessage})
    } catch(error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to Fetch the status",
        variant : "destructive"
      })
    }
    finally{
      setisSwitchLoading(false)
    }
  },[setValue]) 


  const fetchMessages = useCallback(async (refresh : boolean = false) => {
    setIsLoading(true)
    
    try {
      console.log("entered in frontend")
      const response = await axios.get<MyResponse>(`/api/getmessages`)
      // alert(response.data)
      const {data} =  response;
       // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      setMessages(data?.message||[])
      if(refresh){
        toast({
          title : "Refreshed Messages", 
          description:"Showing Latest Messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "",
        description : axiosError.response?.data.message || "Failed to fetch the latest messages",
        variant : "default"
      })
    }
    finally{
      setIsLoading(false)
    }
  },[setIsLoading,setMessages])

 useEffect(()=>{
  if(!session?.user){
    return 
  }
  fetchAcceptMessage();
  fetchMessages();
 },[session,setValue,fetchAcceptMessage])


 // handling switch channging

 const handleswitchChange = async (val : boolean) =>{
  try {
    const newValue = val
    const response = await axios.post<ApiResponse>(`/api/acceptmessages`,{
    acceptmessage : newValue
  })
    // below line need to be discussed
  setValue('acceptMessages',newValue)   // this is changing the value in ui which optimal ui creation
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to fetch the latest messages",
        variant : "destructive"
      })
  }

 }

 if(!session || !session.user){
  return(
    <>
    <div className='w-fullscree h-screen bg-black flext flex items-center'>
    <div className='flex justify-center flex-wrap w-80 m-auto text-xl '>
    <p className='text-white'>You are not an authenticated user</p>
    <div className='text-white'>Please <Link href={'/sign-in'} className='text-blue-600'>Login</Link> or <Link href={'/sign-up'} className='text-blue-600'>Sign-Up</Link></div>
    </div>
    </div>
    </>
  )
 }

console.log( "This is session" + session)

 const username = session?.user as User
  
 // need to be explore
 let baseUrl = '';
if (typeof window !== 'undefined') {
  baseUrl = `${window.location.protocol}//${window.location.host}`;
}
 const profileUrl = `${baseUrl}/u/${username?.username}`

 const copyToClipboard = () =>{
  navigator.clipboard.writeText(profileUrl);
  toast({
    title : "URL copied",
    description :"profile url has been copied to clipboard"
  })
 }

  async function handleLogout() {
    await signOut({callbackUrl : "/sign-in"})
  }

  return (
 <div className="min-h-screen bg-white px-4 py-8 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="bg-gray-100">Logout</Button>
        </div>

        {/* Profile Link */}
        <div className="space-y-2">
          <label className="text-lg font-semibold">Copy Your Unique Link</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        {/* Accept Messages Toggle */}
        <Controller
          name="acceptMessages"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center space-x-3">
              <Switch
                checked={field.value}
                onCheckedChange={(val) => {
                  field.onChange(val);         // update form state
                  handleswitchChange(val);     // call your API
                }}
                disabled={isSwitchLoading}
              />
              <span className="text-sm font-medium">
                Accept Messages:{" "}
                <span className={field.value ? "text-green-600" : "text-red-600"}>
                  {field.value ? "On" : "Off"}
                </span>
              </span>
            </div>
          )}
        />

        {/* Messages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {messages.length > 0 ? (
            messages.map((message, index) => 
              
              
                { 
                  return (
              <MessageCard
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            )})
          ) : (
            <div className="text-gray-500 col-span-2 text-center">
              No messages yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
