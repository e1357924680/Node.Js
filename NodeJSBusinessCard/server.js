const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("./middlewares/cors");
const config = require("config");
const logger = require("./logger/loggerService");
const router = require("./router/router");

const { handleError } = require("./utils/handleErrors");
const connectToDb = require('./db/dbService')
const { generateInitialDataCards, generateInitialDataUsers } = require("./initialData/initialDataService");

app.use(logger);
app.use(cors);
app.use(express.json());
app.use(express.text());
app.use(express.static("./public"));
// app.use(express.static("./public", {
//     maxAge: 1000 * 60 * 60 * 24 * 7,
// }));
app.use(router);

app.use((err, req, res, next) => {
    handleError(res, 500, err.message);
})

const PORT = config.get('PORT');

app.listen(PORT, async () => {
    console.log(chalk.magentaBright(`Listening on: http://localhost:${PORT}`));
    await connectToDb();
    let id = await generateInitialDataUsers();
    generateInitialDataCards(id);
})