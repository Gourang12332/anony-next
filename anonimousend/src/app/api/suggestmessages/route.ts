import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
  const prompt ="Generate three casual, personal questions that a user might ask in an anonymous messaging scenario, similar to What are you doing? or What's your age? Each question should be separated by ||."



  const result = streamText({
    model: openai('gpt-3.5-turbo-instruct'),
    system: 'You are a helpful assistant.',
    maxTokens : 2,
    prompt,
  });

  return result.toDataStreamResponse();
  } catch (error) {
    if(error instanceof OpenAI.APIError){
        const {name, status, headers, message} = error
        return Response.json({
            name, headers, status, message
        } , {status : 500})
    } else{
        throw new Error("An unexpected occur in suggesting suggestions " + error)
    }
  }
}