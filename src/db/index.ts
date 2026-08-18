import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as wordSetsSchema from "./schema/word-sets";

/*The postgres client*/
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

/*Drizzle instance with the schema attached*/
export const db = drizzle(client, { schema: { ...wordSetsSchema } });
