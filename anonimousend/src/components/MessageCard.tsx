"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Message } from "@/app/models/User"
import { ApiResponse } from "@/app/types/ApiResponse"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// interface Message {
//   _id: string;
//   content: string;
//   createdAt: string; // use Date if it's parsed
// }
type MessageCardProps = {
    key : number,
    message : Message,
    onMessageDelete : (messageId : string) => void
}

export default function MessageCard({message,onMessageDelete} : MessageCardProps) {
    const router = useRouter()
    console.log(typeof(message))
    const handleDelteConfirm = async () =>{
    
    const response = await axios.delete<ApiResponse>(`/api/delete-message`,{
      params : {
        messageId : message._id
      }
    })
    toast({
        title : response.data.message
    })
    window.location.reload()
    }
  
  return (
    <Card className="p-4">
    <CardHeader>
        <CardTitle>Anonymous Message</CardTitle>
        <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
        <p>{message.content || "No Content Provided"}</p>
    </CardContent>
    <CardFooter>
        <p>
        {
          typeof message.createdAt === 'string' || message.createdAt instanceof Date
            ? Math.floor((new Date().getTime() - new Date(message.createdAt).getTime()) / (60 * 1000))
            : 0
        } minutes ago
      </p>

    </CardFooter>
     <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Message</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this message from our Servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
</Card>

  )
}
