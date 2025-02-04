import { AppDataSource } from "../data-source";

class MovieRepository {

    getlargestInterval() {
        return AppDataSource.manager.query(`WITH winning_movies
                                                AS (SELECT p.NAME AS producer_name,
                                                            m.year AS movie_year,
                                                            m.winner
                                                    FROM   producers p
                                                            JOIN movies_producers mp
                                                            ON p.id = mp.producersid
                                                            JOIN movies m
                                                            ON m.id = mp.moviesid
                                                    WHERE  m.winner = 1),
                                                ranked_winnings
                                                AS (SELECT producer_name,
                                                            movie_year,
                                                            Row_number()
                                                            OVER (
                                                                partition BY producer_name
                                                                ORDER BY movie_year) AS rn
                                                    FROM   winning_movies),
                                                intervals
                                                AS (SELECT w1.producer_name,
                                                            w1.movie_year                 AS first_movie_year,
                                                            w2.movie_year                 AS second_movie_year,
                                                            w2.movie_year - w1.movie_year AS interval_years
                                                    FROM   ranked_winnings w1
                                                            JOIN ranked_winnings w2
                                                            ON w1.producer_name = w2.producer_name
                                                                AND w1.rn = w2.rn - 1),
                                                max_intervals
                                                AS (SELECT producer_name,
                                                            Max(interval_years) AS longest_interval
                                                    FROM   intervals
                                                    GROUP  BY producer_name),
                                                ranked_intervals
                                                AS (SELECT i.producer_name,
                                                            i.first_movie_year,
                                                            i.second_movie_year,
                                                            i.interval_years,
                                                            m.longest_interval,
                                                            Rank()
                                                            OVER (
                                                                ORDER BY m.longest_interval DESC) AS ranking
                                                    FROM   intervals i
                                                            JOIN max_intervals m
                                                            ON i.producer_name = m.producer_name
                                                                AND i.interval_years = m.longest_interval)
                                            SELECT producer_name,
                                                longest_interval,
                                                first_movie_year,
                                                second_movie_year,
                                                interval_years
                                            FROM   ranked_intervals
                                            WHERE  ranking = 1
                                            ORDER  BY producer_name;`)
    }

    getShortestInterval() {
        return AppDataSource.manager.query(` WITH winning_movies
                                                AS (SELECT p.NAME AS producer_name,
                                                            m.year AS movie_year
                                                    FROM   producers p
                                                            JOIN movies_producers mp
                                                            ON p.id = mp.producersid
                                                            JOIN movies m
                                                            ON m.id = mp.moviesid
                                                    WHERE  m.winner = 1),
                                                ranked_winnings
                                                AS (SELECT producer_name,
                                                            movie_year,
                                                            Row_number()
                                                            OVER (
                                                                partition BY producer_name
                                                                ORDER BY movie_year) AS rn
                                                    FROM   winning_movies),
                                                intervals
                                                AS (SELECT w1.producer_name,
                                                            w1.movie_year                 AS first_movie_year,
                                                            w2.movie_year                 AS second_movie_year,
                                                            w2.movie_year - w1.movie_year AS interval_years
                                                    FROM   ranked_winnings w1
                                                            JOIN ranked_winnings w2
                                                            ON w1.producer_name = w2.producer_name
                                                                AND w1.rn = w2.rn - 1),
                                                min_intervals
                                                AS (SELECT producer_name,
                                                            Min(interval_years) AS shortest_interval
                                                    FROM   intervals
                                                    GROUP  BY producer_name),
                                                ranked_min_intervals
                                                AS (SELECT i.producer_name,
                                                            i.first_movie_year,
                                                            i.second_movie_year,
                                                            i.interval_years,
                                                            m.shortest_interval,
                                                            Rank()
                                                            OVER (
                                                                ORDER BY m.shortest_interval ASC) AS ranking
                                                    FROM   intervals i
                                                            JOIN min_intervals m
                                                            ON i.producer_name = m.producer_name
                                                                AND i.interval_years = m.shortest_interval)
                                            SELECT producer_name,
                                                shortest_interval,
                                                first_movie_year,
                                                second_movie_year,
                                                interval_years
                                            FROM   ranked_min_intervals
                                            WHERE  ranking = 1
                                            ORDER  BY producer_name;  
                                            `)
    }

}
export default new MovieRepository