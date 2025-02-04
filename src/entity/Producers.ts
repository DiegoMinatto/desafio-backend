import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm"
import { Movies } from "./Movies"

@Entity()
export class Producers {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    name: string

    @ManyToMany(() => Movies, (movies) => movies.producers)
    @JoinTable({name: "movies_producers"})
    movies: Movies[]
}