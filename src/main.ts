import express from "express";
import { errorMiddleware } from "./middlewares/error-middleware";
import { notFoundMiddleware } from "./middlewares/not-found-middleware";
import { userRoute } from "./modules/user/user-route";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// ROUTE
app.use(userRoute);

// MIDDLEWARE
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));
