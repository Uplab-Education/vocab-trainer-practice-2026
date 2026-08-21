import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as wordSetsSchema from "./schema/word-sets";
import * as usersSchema from "./schema/users";
import * as progressSchema from "./schema/progress";

const connectionString = process.env.DATABASE_URL!;

// Keep the postgres client global, to avoid the "too many clients" error during development
const globalForDb = globalThis as unknown as {
  postgresClient: postgres.Sql | undefined;
};

// Create the postgres client only if it doesn't already exist, with a limit of 10 connections
const client = globalForDb.postgresClient || postgres(connectionString, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

/*Drizzle instance with the schema attached*/
export const db = drizzle(client, { 
  schema: { 
    ...wordSetsSchema,
    ...usersSchema,
    ...progressSchema
  } 
});