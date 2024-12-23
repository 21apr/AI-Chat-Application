import express from 'express';
import { addUser, getUser, login, register } from '../controllers/usersCont';
import { checkUser } from '../middlewares/authMiddleware';
import { addMessage, getMessages, deleteFile } from '../controllers/chatsCont';
const router = express.Router();

router
.post("/register", register)
.post("/login", login);


router.use(checkUser);
router
.post("/add-client", addUser)
.get("/getUser", getUser)
.get("/:chatId/messages", getMessages)
.post("/addMessage", addMessage)
.delete("/:chatId/deleteFile", deleteFile)


export default router