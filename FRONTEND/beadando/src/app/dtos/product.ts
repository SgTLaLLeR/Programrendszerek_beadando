import {z} from "zod";

export const ProductDTOInput = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  uploadedAt: z.date(),
  userId: z.string()
});

export const ProductDTOOutput = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  uploadedAt: z.date(),
  userId: z.string(),
  image : z.string().optional()
});

export const ProductFilterDTOInput =z.object({
  name: z.string().optional(),
  priceStart: z.number().optional(),
  priceEnd: z.number().optional(),
  dateOrder: z.string().optional(),
  priceOrder: z.string().optional()
});

export type ZProductDTOInput = z.infer<typeof ProductDTOInput>;
export type ZProductDTOOutput = z.infer<typeof ProductDTOOutput>;
export type ZProductFilterDTOInput = z.infer<typeof ProductFilterDTOInput>;
