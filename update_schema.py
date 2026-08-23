import codecs
import re

with codecs.open("src/db/schema.ts", "r", "utf-8") as f:
    text = f.read()

# 1. Update customers table
old_customers = """export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  birthdate: varchar("birthdate"),
  walletPassId: varchar("wallet_pass_id").unique(),
  webPushSub: text("web_push_sub"),
});"""

new_customers = """export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  birthdate: varchar("birthdate"),
  walletPassId: varchar("wallet_pass_id").unique(),
  webPushSub: text("web_push_sub"),
  referredBy: uuid("referred_by"),
  hasRedeemedWelcomeBonus: boolean("has_redeemed_welcome_bonus").default(false),
});"""

text = text.replace(old_customers, new_customers)

# 2. Update stampsLog table
old_stamps = """export const stampsLog = pgTable("stamps_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  staffId: uuid("staff_id").references(() => businessStaff.id, { onDelete: "set null" }),
  stampedAt: timestamp("stamped_at").defaultNow(),
});"""

new_stamps = """export const stampsLog = pgTable("stamps_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  staffId: uuid("staff_id").references(() => businessStaff.id, { onDelete: "set null" }),
  stampedAt: timestamp("stamped_at").defaultNow(),
  isReferralBonus: boolean("is_referral_bonus").default(false),
});"""

text = text.replace(old_stamps, new_stamps)

with codecs.open("src/db/schema.ts", "w", "utf-8") as f:
    f.write(text)
