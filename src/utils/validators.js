const { z } = require("zod");

 const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.enum(["TRADER", "BROWSER1", "BROWSER2", "ADMIN"]),
});

 const landSchema = z.object({
  traderId: z.string(),
  name: z.string(),
  location: z.string(),
  priceBefore: z.number(),
  priceAfter: z.number(),
  neighborhood: z.string(),
  ownerName: z.string(),
  ownerPhone: z.string(),
});

 const bidSchema = z.object({
  userId: z.string(),
  auctionId: z.string(),
  amount: z.number().positive("Bid amount must be positive"),
});

module.exports = { userSchema, landSchema, bidSchema };