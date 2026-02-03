import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST || "localhost",
    port: Number(DB_PORT || "3306"),
    username: DB_USERNAME || "root",
    password: DB_PASSWORD || "",
    database: DB_NAME || "bancopi", 
    synchronize: false,
    logging: true,
    entities: [__dirname + "/../models/*.ts"],
    migrations: [__dirname + "/../migrations/*.ts"],
});