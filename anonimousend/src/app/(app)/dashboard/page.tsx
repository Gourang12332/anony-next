"use client"

import { Message } from '@/app/models/User'
import { AcceptSchema } from '@/app/Schemas/acceptSchema';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { use, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import { User } from 'next-auth';
import { Switch } from '@/components/ui/switch';
import MessageCard from '@/components/MessageCard';
import Link from 'next/link';

export default function page() {
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState(false)
  const[isSwitchLoading , setisSwitchLoading] = useState(false)

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
    resolver : zodResolver(AcceptSchema)
  })
  // so form here is an object containing register, watch and setvalue , we are destructuring to use them out of the form

  const {register,watch,setValue} = form;

  // accepting messages is the watch state , which confirm that the user is accepitng or declining message
  const acceptMessages = watch('acceptMessages') // a big game here , watching the field with acceptmessages

  
  const fetchAcceptMessage = useCallback(async () =>{
    setisSwitchLoading(true);

    try{
      const response = await axios.get('/api/acceptmessages')
      setValue('acceptMessages',response.data.isAcceptingMessage)
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
      const response = await axios.get<ApiResponse>(`/api/get-messages`)
      setMessages(response.data.messages||[])
      if(refresh){
        toast({
          title : "Refreshed Messages",
          description:"Showing Latest Messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to fetch the latest messages",
        variant : "destructive"
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

 const handleswitchChange = async () =>{
  try {
    const response = await axios.post<ApiResponse>(`/api/acceptmessages`,{
    acceptMessages : !acceptMessages
  })
  // below line need to be discussed
  setValue('acceptMessages',!acceptMessages)   // this is changing the value in ui which optimal ui creation
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to fetch the latest messages",
        variant : "destructive"
      })
  }

 }

//  if(!session || !session.user){
//   return(
//     <>
//     <div>Please Login</div>
//     <Link href={'/sign-up'}>Go to Sign Up</Link>
//     </>
//   )
//  }


 const username = session?.user as User
 // need to be explore
 const baseUrl = `${window.location.protocol}//${window.location.host}`
 const profileUrl = `${baseUrl}/u/${username}`

 const copyToClipboard = () =>{
  navigator.clipboard.writeText(profileUrl);
  toast({
    title : "URL copied",
    description :"profile url has been copied to clipboard"
  })
 }

  return (
    <div>
      <div>
        <input type="text" value={profileUrl} />
        <button onClick={copyToClipboard}>Copy to Clipboard</button>
      </div>

    <div>
     <Switch
     {...register('acceptMessages')}
     checked={acceptMessages}
     onCheckedChange={handleswitchChange}
     disabled={isSwitchLoading}  //disable toggling of switch
     ></Switch>
     <span>
      Accept Messages: {acceptMessages ? 'On' : 'off'}
     </span>
     <div>
      {
        messages.length>0 ?
        (messages.map((message,index)=>{
          return (
            <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage}/>
          )
          
        }
        )) :
        <></>
      }
     </div>
    </div>

    </div>
  )
}
