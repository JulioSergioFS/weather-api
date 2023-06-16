require("dotenv").config();
import app from "./app";

app.listen(process.env.PORT, () => console.log("Please hire me"));
