import {z} from "zod";

export const HistoryDTO = z.object({
  id : z.string(),
  productId : z.string(),
  userId : z.string(),
  productName : z.string(),
  productPrice : z.number(),
  purchaseDate : z.date(),
})

export type ZHistoryDTO = z.infer<typeof HistoryDTO>;
