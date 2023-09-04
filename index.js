const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/geolocation", (req, res) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    try {
      const locationData = JSON.parse(data);

      let date_ob = new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      let seconds = date_ob.getSeconds();

      let dateFull =
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

      const geolocation = {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        date: dateFull,
      };

      const jsonData = JSON.stringify(geolocation);

      fs.appendFile("log.txt", jsonData + "\n", (err) => {
        if (err) {
          console.error("Erro ao escrever no arquivo de log:", err);
          res
            .status(500)
            .json({ error: "Erro ao escrever no arquivo de log." });
        } else {
          console.log("Localização do criminoso detectado:" + jsonData);
          res.json(geolocation);
        }
      });
    } catch (error) {
      console.error("Erro ao processar dados de geolocalização:", error);
      res
        .status(400)
        .json({ error: "Erro ao processar dados de geolocalização." });
    }
  });
});

app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({ error: "Erro interno no servidor." });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
