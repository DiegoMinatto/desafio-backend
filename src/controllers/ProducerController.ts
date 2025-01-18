import { AppDataSource } from "../data-source";

class DispositivosController {
  async getMinAndMaxPrizeInterval(req, res) {
    try {
      var largestInterval = await AppDataSource.manager.query(
        `WITH winning_movies AS (
            SELECT
                p.name AS producer_name,
                m.year AS movie_year,
                m.winner
            FROM
                producers p
            JOIN movies_producers mp ON
                p.id = mp.producersId
            JOIN movies m ON
                m.id = mp.moviesId
            WHERE
                m.winner = 1 ),
            ranked_winnings AS (
            SELECT
                producer_name,
                movie_year,
                ROW_NUMBER() OVER (PARTITION BY producer_name
            ORDER BY
                movie_year) AS rn
            FROM
                winning_movies ),
            intervals AS (
            SELECT
                w1.producer_name,
                w1.movie_year AS first_movie_year,
                w2.movie_year AS second_movie_year,
                w2.movie_year - w1.movie_year AS interval_years
            FROM
                ranked_winnings w1
            JOIN ranked_winnings w2 ON
                w1.producer_name = w2.producer_name
                AND w1.rn = w2.rn - 1 )
            SELECT
                producer_name,
                MAX(interval_years) AS longest_interval,
                first_movie_year,
                second_movie_year,
                interval_years
            FROM
                intervals
            GROUP BY
                producer_name,
                first_movie_year,
                second_movie_year,
                interval_years
            ORDER BY
                longest_interval DESC
            LIMIT 1;`
      );

      const max = await largestInterval.map((values) => {
        return {
          producer: values.producer_name,
          interval: values.interval_years,
          previousWin: values.first_movie_year,
          followingWin: values.second_movie_year,
        };
      });


      var shortestInterval = await AppDataSource.manager.query(
        ` WITH winning_movies AS (
            SELECT
                p.name AS producer_name,
                m.year AS movie_year
            FROM
                producers p
            JOIN movies_producers mp ON
                p.id = mp.producersId
            JOIN movies m ON
                m.id = mp.moviesId
            WHERE
                m.winner = 1 ),
            ranked_winnings AS (
            SELECT
                producer_name,
                movie_year,
                ROW_NUMBER() OVER (PARTITION BY producer_name
            ORDER BY
                movie_year) AS rn
            FROM
                winning_movies ),
            intervals AS (
            SELECT
                w1.producer_name,
                w1.movie_year AS first_movie_year,
                w2.movie_year AS second_movie_year,
                w2.movie_year - w1.movie_year AS interval_years
            FROM
                ranked_winnings w1
            JOIN ranked_winnings w2 ON
                w1.producer_name = w2.producer_name
                AND w1.rn = w2.rn - 1 )
            SELECT
                producer_name,
                MIN(interval_years) AS shortest_interval,
                first_movie_year,
                second_movie_year,
                interval_years
            FROM
                intervals
            GROUP BY
                producer_name,
                first_movie_year,
                second_movie_year
            ORDER BY
                shortest_interval ASC
            LIMIT 1;`
      )

      console.log(shortestInterval)


      const min = await shortestInterval.map((values) => {
        return {
          producer: values.producer_name,
          interval: values.interval_years,
          previousWin: values.first_movie_year,
          followingWin: values.second_movie_year,
        };
      });



      res.status(200).json({min: min, max: max});
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "Erro interno!" });
    }
  }
}

export default new DispositivosController();
