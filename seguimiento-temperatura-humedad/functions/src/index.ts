/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import {BigQuery} from "@google-cloud/bigquery";

const app = express();
app.use(cors({origin: true}));

const bigquery = new BigQuery();

// Endpoint para obtener todos los registros
app.get("/getAllRecords", async (req, res) => {
  const query = `
    SELECT dev_id, propietario, tiempo_registro, temperatura, humedad
    FROM \`daiot-tp.datos.sensores_tph_5min_interval\` 
    ORDER BY tiempo_registro ASC
  `;

  const options = {
    query: query,
    location: "southamerica-east1",
  };

  try {
    const [rows] = await bigquery.query(options);
    res.status(200).send(rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint para obtener el último registro por dispositivo
app.get("/getLastRecords", async (req, res) => {
  const query = `
    SELECT A.dev_id, propietario, A.tiempo_registro, temperatura, humedad
    FROM \`daiot-tp.datos.sensores_tph_5min_interval\` A
    INNER JOIN (
      SELECT dev_id, MAX(tiempo_registro) as tiempo_registro
      FROM \`daiot-tp.datos.sensores_tph_5min_interval\`
      GROUP BY dev_id
    ) B ON A.dev_id=B.dev_id AND A.tiempo_registro=B.tiempo_registro
  `;

  const options = {
    query: query,
    location: "southamerica-east1",
  };

  try {
    const [rows] = await bigquery.query(options);
    res.status(200).send(rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.api = functions.https.onRequest(app);
