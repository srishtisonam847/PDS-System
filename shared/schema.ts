import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'shop', 'beneficiary', 'admin'
  name: text("name").notNull(),
  shopId: varchar("shop_id"),
});

export const shops = pgTable("shops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  contactNumber: text("contact_number"),
});

export const stock = pgTable("stock", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull(),
  itemType: text("item_type").notNull(), // 'rice', 'wheat', 'sugar', 'kerosene'
  quantity: integer("quantity").notNull().default(0),
  unit: text("unit").notNull(), // 'kg', 'L'
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const beneficiaries = pgTable("beneficiaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  shopId: varchar("shop_id").notNull(),
  rationCardNumber: text("ration_card_number").notNull().unique(),
  familySize: integer("family_size").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertShopSchema = createInsertSchema(shops).omit({
  id: true,
});

export const insertStockSchema = createInsertSchema(stock).omit({
  id: true,
  lastUpdated: true,
});

export const insertBeneficiarySchema = createInsertSchema(beneficiaries).omit({
  id: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['shop', 'beneficiary', 'admin']),
});

export const stockUpdateSchema = z.object({
  rice: z.number().min(0).optional(),
  wheat: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  kerosene: z.number().min(0).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertShop = z.infer<typeof insertShopSchema>;
export type Shop = typeof shops.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;
export type Stock = typeof stock.$inferSelect;
export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type Beneficiary = typeof beneficiaries.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type StockUpdateData = z.infer<typeof stockUpdateSchema>;
