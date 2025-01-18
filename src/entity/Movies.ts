import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm"
import { Producers } from "./Producers"

@Entity()
export class Movies {
    @PrimaryGeneratedColumn()
    id: number

    @Column("int")
    year: number

    @Column("varchar")
    title: string

    @Column("varchar")
    studios: string

    @Column("int")
    winner: number

    @ManyToMany(() => Producers, (producers) => producers.movies)
    producers: Producers[]

}