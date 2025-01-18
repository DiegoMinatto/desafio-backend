
import express from "express"
import ProducerController from "./controllers/ProducerController"

const routes = express.Router();

const getRoutes = () => {

  routes.get('/api/producers/MinAndMaxPrizeInterval', ProducerController.getMinAndMaxPrizeInterval);

  return routes;
};

export default getRoutes;
