"use client"

import React from 'react'
import {messages} from "./messages"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-Autoplay'
import { Card, CardContent,CardHeader,CardFooter } from "@/components/ui/card"


export default function Home() {
  return (
    <div className=" m-auto">
      <p className='font-bold font-sans text-xl'>Dive Deep with us</p>
       <Carousel className="w-full max-w-xs" plugins={[Autoplay({delay : 2000})]}>
        
      <CarouselContent>
        {
          messages.map((message,index) =>{
            return(
              <CarouselItem key={index}>
                <div>
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent>
                      {message.description}
                    </CardContent>
                    <CardFooter>
                      {message.received}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            )
          })
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
  )
}
