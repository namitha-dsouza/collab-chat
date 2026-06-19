import * as z from "zod"; 

export const registerSchema = z.object({

   userName: z.string().min(3).max(30),
   email: z.string().email(),
   password: z.string().min(8),
});

export const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(8),
});

export const messageSchema = z.object({
   content: z.string().min(1).max(500)
});
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type MessageInput = z.infer<typeof messageSchema>;


