import {z} from "zod";

export const FileDTOInput = z.object({
    originalname: z.string(),
    path: z.string(),
});

export const FileDTOOutput = z.object({
    id : z.string(),
    originalname: z.string(),
    path: z.string(),
    productId: z.string(),
})
export type ZFileDTOInput = z.infer<typeof FileDTOInput>;
export type ZFileDTOOutput = z.infer<typeof FileDTOOutput>;