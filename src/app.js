const http = require("http");

// const hostname = "127.0.0.1";
// const port = 3000;

// const server = http.createServer( (req, res) => {
//     res.statusCode = 200;
//     res.setHeader("Content-type", "text/plain");
//     res.end("Olá Mundo!");
// });

// server.listen(port, hostname, () => {
//     console.log(`Servidor em execução em http://${hostname}:${port}`);
// });

const express = require("express");
const status = require("http-status");
const spoilersRoute = require("./routes/spoilers");
const sequelize = require("./database/database");

const app = express();

app.use(express.json());    // define que a API vai retornar json

app.use("/api", spoilersRoute);

// se nenhuma rota for identificada, o express direciona para o error abaixo
app.use((request, response, next) => {
  response.status(status.NOT_FOUND).send();
});

app.use((error, request, response, next) => {
  response.status(status.INTERNAL_SERVER_ERROR).json({ error });    // força o retorno em json
});

// aqui faz a conexão com o banco de dados. Se a conexão for ok, inicializa o servidor
// Criará a tabela se não existir! Não cria o banco!!!
// Com o force: true a tabela vai ser criada TODA vez que subir a aplicação!
sequelize.sync({ force: false }).then(() => {
  const port = process.env.PORT || 3000;

  app.set("port", port);

  const server = http.createServer(app);

  server.listen(port);
});
