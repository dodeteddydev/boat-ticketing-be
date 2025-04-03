import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { authRoute } from "./modules/auth/auth-route";
import { cityRoute } from "./modules/city/city-route";
import { countryRoute } from "./modules/country/country-route";
import { provinceRoute } from "./modules/province/province-route";
import { userRoute } from "./modules/user/user-route";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cors());

// ROUTE
app.use(authRoute);
app.use(userRoute);
app.use(countryRoute);
app.use(provinceRoute);
app.use(cityRoute);

// MIDDLEWARE
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));
