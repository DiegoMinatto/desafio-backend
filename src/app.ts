import express, { Application } from 'express'
import routes from './routes';
import { AppDataSource } from './data-source';
import { Producers } from './entity/Producers';
import { Movies } from './entity/Movies';
import path from 'path';
import fs from "fs";
import csv from "csv-parser";

class App {
    public app: Application


    constructor() {

        this.app = express();
        this.app.use(routes());
        this.config();

    }

    processaArquivo = () => {
        const promiseCSV = new Promise((resolve, reject) => {
            try {
                var csvData = [];
                fs.createReadStream(path.join("data", "movielist.csv"))
                    .pipe(csv({ separator: ";" }))
                    .on("data", function (csvrow) {
                        csvData.push(csvrow);
                    })
                    .on("end", function () {
                        resolve(csvData);
                    });
            } catch (error) {
                reject(error);
            }
        });

        return promiseCSV;
    }


    alimentaDatabaseCSV = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const dadosCsv: any = await this.processaArquivo();

                for (const element of dadosCsv) {
                    var producersData = [];
                    var producersInsert = [];

                    if (element.producers.toLowerCase().includes(" and ")) {
                        const splitProducerAnd = element.producers.split(" and ");

                        producersData.push(splitProducerAnd[1]);

                        if (splitProducerAnd[0].includes(",")) {
                            const splitProducerComma = splitProducerAnd[0].split(", ");

                            producersData = [...splitProducerComma, ...producersData];
                        } else {
                            producersData.push(splitProducerAnd[0]);
                        }
                    } else {
                        producersData.push(element.producers);
                    }

                    producersData = producersData.map((value) =>
                        value.replace(",", "").trim()
                    );

                    for (const name of producersData) {
                        const producerRepository = AppDataSource.getRepository("Producers");

                        const isProducerAdded = await producerRepository.findOneBy({
                            name: name,
                        });

                        if (isProducerAdded) {
                            producersInsert.push(isProducerAdded);
                        } else {
                            const producer = new Producers();
                            producer.name = name;
                            await AppDataSource.manager.save(producer);
                            producersInsert.push(producer);
                        }
                    }

                    const movie = new Movies();
                    movie.year = Number(element.year);
                    movie.title = element.title;
                    movie.studios = element.studios;
                    movie.winner = element.winner.trim() == "yes" ? 1 : 0;
                    movie.producers = producersInsert;
                    await AppDataSource.manager.save(movie);

                }

                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    config = async () => {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        
    }

    listen = async (port: number) => {
        await this.alimentaDatabaseCSV();
        this.app.listen(port, () => console.log("Server is running"));
    }


}

export { App }