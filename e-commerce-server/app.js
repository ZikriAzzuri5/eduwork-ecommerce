const express = require("express");
const axios = require("axios");
const cors = require("cors");
const config = require("./config");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/api/provinces", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: {
          key: config.secretkey,
        },
      }
    );
    return res.json(response.data.rajaongkir.results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/cities/:provinceId", async (req, res) => {
  const { provinceId } = req.params;
  try {
    const response = await axios.get(
      `https://api.rajaongkir.com/starter/city?province=${provinceId}`,
      {
        headers: {
          key: config.secretkey,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/cost", async (req, res) => {
  const origin = req.body.origin || "151";
  const destination = req.body.destination;
  const weight = req.body.weight;
  const courier = req.body.courier;

  try {
    const response = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin,
        destination,
        weight,
        courier,
      },
      {
        headers: {
          key: config.secretkey,
        },
      }
    );

    const data = response.data;
    const formattedResponse = {
      rajaongkir: {
        query: { origin, destination, weight, courier },
        status: data.rajaongkir.status,
        origin_details: data.rajaongkir.origin_details,
        destination_details: data.rajaongkir.destination_details,
        results: data.rajaongkir.results.map((result) => ({
          code: result.code,
          name: result.name,
          costs: result.costs.map((cost) => ({
            service: cost.service,
            description: cost.description,
            cost: cost.cost.map((c) => ({
              value: c.value,
              etd: c.etd,
              note: c.note,
            })),
          })),
        })),
      },
    };
    res.json(formattedResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res, next) => {
  res.status(404);
  res.send({
    status: "failed",
    message: `Resource ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
