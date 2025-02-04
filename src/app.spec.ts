import request from 'supertest';
import { App } from "./app";
import { AppDataSource } from '../src/data-source';

var appObject;
var app;

beforeAll(async () => {

    await AppDataSource.initialize();
    appObject = new App();
    await appObject.feedData()
    app = appObject.app;

});


afterAll(async () => {
    await AppDataSource.destroy();
});

describe('GET /api/producers/MinAndMaxPrizeInterval', () => {
    it('should return the correct min and max intervals', async () => {

        const response = await request(app).get('/api/producers/MinAndMaxPrizeInterval');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            min: [
 
                { producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }
            ],
            max: [
                { producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }
            ]
        });
    });

   
  
});
