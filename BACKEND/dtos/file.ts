import {z} from "zod";

export const FileDTOInput = z.object({
    originalname: z.string(),
    path: z.string(),
});

export type ZFileDTOInput = z.infer<typeof FileDTOInput>;