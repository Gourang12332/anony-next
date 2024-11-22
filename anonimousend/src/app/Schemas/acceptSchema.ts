import {z} from 'zod'

export const AcceptSchema = z.object({
    acceptMessages : z.boolean(),
})