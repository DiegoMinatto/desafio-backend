import MovieRepository from "../model/MovieRepository";

class ProducerController {
    async getMinAndMaxPrizeInterval(req, res) {
        try {
            var largestInterval = await MovieRepository.getlargestInterval();
            const max = await largestInterval.map((values) => {
                return {
                    producer: values.producer_name,
                    interval: values.interval_years,
                    previousWin: values.first_movie_year,
                    followingWin: values.second_movie_year,
                };
            });
            var shortestInterval = await MovieRepository.getShortestInterval();
            const min = await shortestInterval.map((values) => {
                return {
                    producer: values.producer_name,
                    interval: values.interval_years,
                    previousWin: values.first_movie_year,
                    followingWin: values.second_movie_year,
                };
            });
            res.status(200).json({ min: min, max: max });
        } catch (error) {
            console.log(error)
            res.status(400).json({ msg: "Erro interno!" });
        }
    }
}

export default new ProducerController();