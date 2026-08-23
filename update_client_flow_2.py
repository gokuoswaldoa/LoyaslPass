import codecs

with codecs.open("src/app/actions/clientFlow.ts", "r", "utf-8") as f:
    text = f.read()

new_func = """
export async function getCustomerNameById(customerId: string) {
  try {
    const customerArray = await db.select().from(customers).where(eq(customers.id, customerId));
    if (customerArray.length > 0) {
      return customerArray[0].name;
    }
    return null;
  } catch (error) {
    return null;
  }
}
"""

text += new_func

with codecs.open("src/app/actions/clientFlow.ts", "w", "utf-8") as f:
    f.write(text)
