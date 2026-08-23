import codecs

with codecs.open("src/app/actions/clientFlow.ts", "r", "utf-8") as f:
    text = f.read()

old_func_def = 'export async function registerCustomer(businessId: string, name: string, phone: string, email: string, birthdate: string = "") {'
new_func_def = 'export async function registerCustomer(businessId: string, name: string, phone: string, email: string, birthdate: string = "", referredBy: string | null = null) {'
text = text.replace(old_func_def, new_func_def)

old_insert = """    const inserted = await db.insert(customers).values({
      businessId,
      name,
      phoneNumber: phone,
      email: email || null,
      birthdate: birthdate || null,
      walletPassId,
    }).returning();"""

new_insert = """    const inserted = await db.insert(customers).values({
      businessId,
      name,
      phoneNumber: phone,
      email: email || null,
      birthdate: birthdate || null,
      walletPassId,
      referredBy: referredBy || null,
    }).returning();"""

text = text.replace(old_insert, new_insert)

with codecs.open("src/app/actions/clientFlow.ts", "w", "utf-8") as f:
    f.write(text)
