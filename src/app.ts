import express from "express";
import router from "./router";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(router);

export default app;
