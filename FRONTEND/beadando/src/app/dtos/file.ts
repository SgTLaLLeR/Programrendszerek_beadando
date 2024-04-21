import {z} from "zod";

export const FileDTOOutput = z.object({
  id: z.string(),
  originalname: z.string(),
  path: z.string(),
  userId: z.string(),
  productId: z.string(),
});

export type ZFileDTOOutput = z.infer<typeof FileDTOOutput>;
