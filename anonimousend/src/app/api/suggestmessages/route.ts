// import { streamText } from 'ai';
// import { openai } from '@ai-sdk/openai';

import { NextRequest } from "next/server";

 
// // This method must be named GET
// export async function GET() {
//   // Make a request to OpenAI's API based on
//   // a placeholder prompt
//   const response = streamText({
//     model: openai('gpt-4o-mini'),
//     messages: [{ role: 'user', content: 'What is the capital of Australia?' }],
//   });
//   // Respond with the stream
//   return response.toTextStreamResponse({
//     headers: {
//       'Content-Type': 'text/event-stream',
//     },
//   });
// }

// ✅ Valid route handler
export async function POST(req: NextRequest) {
  return new Response("Hello from suggestmessages");
}
