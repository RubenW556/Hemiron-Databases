import {DataSource} from "typeorm";
import {Post} from "@nestjs/common";
import {User} from "../user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER_USERNAME,
    password: process.env.POSTGRES_USER_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    logging: true,
    entities: [Post, User],
    subscribers: [],
    migrations: [],
})


