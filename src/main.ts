import express from "express";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { userRoute } from "./modules/user/user-route";
import cors from "cors";
import { countryRoute } from "./modules/country/country-route";
import { provinceRoute } from "./modules/province/province-route";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cors());

// ROUTE
app.use(userRoute);
app.use(countryRoute);
app.use(provinceRoute);

// MIDDLEWARE
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));
