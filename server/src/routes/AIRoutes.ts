import  express  from "express";
import { getAnswer } from "../controllers/aiService";

const router = express.Router();

router.post("/ask", getAnswer )

export default router