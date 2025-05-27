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

type MessageCardProps = {
    message : Message,
    onMessageDelete : (messageId : string) => void
}



export default function MessageCard({message,onMessageDelete} : MessageCardProps) {

    const handleDelteConfirm = async () =>{
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    return toast({
        title : response.data.message
    })
}

  return (
    <Card>
    <CardHeader>
        <CardTitle>Card Title</CardTitle>
         <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
        <p>Card Content</p>
    </CardContent>
    <CardFooter>
        <p>Card Footer</p>
    </CardFooter>
</Card>

  )
}
