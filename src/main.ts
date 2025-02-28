import express from "express";
import "dotenv/config";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));
