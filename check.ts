import { db } from "./src/db/index";
import { passesConfig } from "./src/db/schema";

async function main() {
  const configs = await db.select().from(passesConfig);
  console.log(configs);
}
main();
