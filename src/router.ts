import axios from "axios";
import express from "express";
import jwt from "jsonwebtoken";
import { tokenValidation } from "./auth";
import { key, registeredUser } from "./constants";

const router = express.Router();

// auth
router.post("/login", (req, res) => {
  console.log(req.body);

  try {
    const { email, password } = req.body;
    const userIsValid =
      registeredUser.email === email && registeredUser.password === password;

    if (!userIsValid) {
      return res.status(401).end("E-mail or password incorrect");
    }

    const token = jwt.sign({ user: JSON.stringify(registeredUser) }, key, {
      expiresIn: 60,
    });

    return res.json({ user: JSON.stringify({ email, password }), token }).end();
  } catch (error) {
    console.log(error);
    res.status(500).end(error ? `${error}` : "Something went wrong");
  }

  res.send("Done");
});

//weather
router.get("/weather/:city", async (req, res) => {
  try {
    const isTokenValid = await tokenValidation({ req, res });

    if (isTokenValid !== "validated") {
      return;
    }

    const { city } = req.params;
    let responseData = undefined;
    const apiResponse = await axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.WEATHER_API_KEY}`
      )
      .then(async (response) => {
        if (response?.data?.length && response.data?.length > 0) {
          const cityData = response.data[0];

          await axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.lat}&lon=${cityData.lon}&appid=${process.env.WEATHER_API_KEY}`
            )
            .then(async (response) => {
              console.log(response.data);
              responseData = response.data;
            });
        } else {
          throw new Error("Invalid city name");
        }
      });

    res.end(
      responseData ? JSON.stringify(responseData) : "Done - check console log"
    );
  } catch (err) {
    console.log(err);
    res.status(500).end(err ? `${err}` : "Something went wrong");
  }
});

export default router;
