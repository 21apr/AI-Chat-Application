import express from 'express';
import { addUser, getUser, login, register } from '../controllers/usersCont';
import { checkUser } from '../middlewares/authMiddleware';
import { addMessage, getMessages, setChat } from '../controllers/chatsCont';
const router = express.Router();

router
.post("/register", register)
.post("/login", login);


router.use(checkUser);
router
.post("/add-client", addUser)
.get("/getUser", getUser)
.post("/createChat", setChat)
.get("/:chatId/messages", getMessages)
.post("/addMessage", addMessage)


export default router