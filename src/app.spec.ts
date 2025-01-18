import request from 'supertest';
import { App } from "./app"; // Supondo que o app está sendo exportado de app.ts
import { AppDataSource } from '../src/data-source';

var app;

beforeAll(async () => {

    await AppDataSource.initialize();
    app = new App().app;

    await AppDataSource.manager.query('DELETE FROM movies_producers');
    await AppDataSource.manager.query('DELETE FROM movies;');
    await AppDataSource.manager.query('DELETE FROM producers;');

    // Inserir dados de teste
    await AppDataSource.manager.query(`
    INSERT INTO producers (id, name) VALUES
    (1, 'Producer A'),
    (2, 'Producer B');
`);

    await AppDataSource.manager.query(`INSERT INTO movies (id, title, studios, year, winner) VALUES
    (1, "Movie a", "Studio A", 2000, 1),
    (2, "Movie b", "Studio B", 2005, 1),
    (3, "Movie c", "Studio C", 2010, 0);
`);

    await AppDataSource.manager.query(` INSERT INTO movies_producers (moviesId, producersId) VALUES
    (1, 1),
    (2, 1),
    (3, 2);
  `);

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
                { producer: 'Producer A', interval: 5, previousWin: 2000, followingWin: 2005 }
            ],
            max: [
                { producer: 'Producer A', interval: 5, previousWin: 2000, followingWin: 2005 }
            ]
        });
    });

   
    it('should return empty arrays when no winners exist', async () => {
        // Limpar os dados


        await AppDataSource.manager.query('DELETE FROM movies_producers WHERE moviesId IN (select id from  movies WHERE winner = 1);');
        await AppDataSource.manager.query('DELETE FROM movies WHERE winner = 1;');

        const response = await request(app).get('/api/producers/MinAndMaxPrizeInterval');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ min: [], max: [] });
    });
  
});
