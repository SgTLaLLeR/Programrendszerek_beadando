import {z} from "zod";

export const ProductDTOInput = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    isAvailable: z.boolean(),
    userId: z.string()
});

export type ZProductDTOInput = z.infer<typeof ProductDTOInput>;