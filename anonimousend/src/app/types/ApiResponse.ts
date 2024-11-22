import {Message} from '../models/User'

// we here are designing the structure of api response using interfaces in typescript
export interface ApiResponse {
 success : boolean;
 message : string;
 isAcceptingMessage?: boolean; // while displaying messages to dashboard it will check either it is enable or not
 messages ?: Array<Message>
}

// interfaces takes object for input or fields to check