'use client';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useCompletion } from '@ai-sdk/react'


const sampleMessages = [
  "What is something or someone that always manages to brighten your day?",
  "Tell us about a memorable travel experience you've had.",
  "If you could learn one skill instantly, what would it be?",
];

export default function Page() {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState('');
  const params = useParams();

  const { username } = params;
  const {toast} = useToast();



   const { completion, handleSubmit } = useCompletion({
    api: '/api/suggestmessages',
  });

  const handleClick = () => {
    setSuggestions([]);
    alert(completion)
    };

  async function handleSendMessage(): Promise<void> {
    try {
      const response  = await axios.post('/api/sendmessage',{username,content : message})
      if(response){
        toast({
          title: response.data.message,
          description : "User has accepted the message"
        })
       
      }
    } catch (error) {
      toast({
        title : "Error",
        description  : "There is error sending the message.  Maybe User is not accepting the message",
        variant : "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Public Profile Link</h1>

      <div className="w-full max-w-xl space-y-4">
        <label className="font-semibold">Send Anonymous Message to @{username}.Share your username to get the messages to known</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
          placeholder="Write your anonymous message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={handleSendMessage}
          >
            Send It
          </button>

          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
            // onClick={handleClick}
          >
            Suggest Messages
          </button>
        </div>
      </div>

      <div className="w-full max-w-xl mt-8">
        <p className="mb-2 text-gray-600">Click on any message below to select it.</p>

        <div className="space-y-2">
          { suggestions.length != 0 ?
            suggestions.map((msg, i) => (
            <div
              key={i}
              className="cursor-pointer p-3 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => setMessage(msg)}
            >
              {msg}
            </div>
          ))
           :
          sampleMessages.map((msg, i) => (
            <div
              key={i}
              className="cursor-pointer p-3 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => setMessage(msg)}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

