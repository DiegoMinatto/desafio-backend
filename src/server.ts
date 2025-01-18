import { App } from "./app";
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {

    const app = new App();

    app.listen(3000)

}).catch(error => console.log(error))

;