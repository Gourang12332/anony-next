"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import {messages} from "./messages"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 gap-8 px-4 text-white">
        <p className="font-bold font-sans text-7xl mt-12 space-x-14">Dive Deep with us</p>
        <Carousel className="w-full max-w-md" plugins={[Autoplay({ delay: 2000 })]}>
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card className="bg-gray-800 text-white shadow-2xl rounded-2xl border border-gray-700">
                  <CardHeader className="text-lg font-semibold">{message.title}</CardHeader>
                  <CardContent className="text-sm">{message.description}</CardContent>
                  <CardFooter className="text-xs text-gray-400">{message.received}</CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </div>
    </div>
  )
}
