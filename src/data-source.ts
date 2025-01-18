import "reflect-metadata"
import { DataSource } from "typeorm"
import { Movies } from "./entity/Movies"
import { Producers } from "./entity/Producers"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [Movies, Producers],
    migrations: [],
    subscribers: [],
})
