import express from "express";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import "dotenv/config";
import AIRoutes from "./routes/AIRoutes";
import userRoutes from "./routes/userRoutes";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

//DB
const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

mongoose.connect(`${MONGO_URL}/${MONGO_DB_NAME}`).then(() => console.log('DB connected'));

app.use("/api", AIRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
