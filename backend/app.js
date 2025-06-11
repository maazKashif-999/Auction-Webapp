import express from "express";
import cors from "cors";
export const app = express();
import { route } from "./routes/usersROute.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',route)
