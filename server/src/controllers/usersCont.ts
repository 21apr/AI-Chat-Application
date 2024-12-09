import { UserModel } from "./../models/users/UserModel";
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import { ChatModel } from "../models/chats/ChatModel";
const saltRounds = Number(process.env.SALT_BCRYPT) || 10;


export const secret = process.env.SECRET || "secret"


export async function addUser(req: any, res: any) {
    try {
        const {
            firstName,
            password,
            lastName,
            email,
        } = req.body;

        const result = await UserModel.create({
            firstName,
            password,
            lastName,
            email,
        })
        console.log(result)
        if (!result) {
            return res.status(400).send({ error: "Couldn't create new user" })
        }

        return res.status(201).send({ message: "Client created successfully" })


    } catch (error: any) {
        console.error(error)
        return res.status(500).send({ error: error.message })
    }
}

export async function getUser(req: any, res: any) {
    try {

        const  userId  = req.userId;

        console.log("getUser", userId)

        const user = await UserModel.findById(userId);
        const chats = await ChatModel.find({ user: userId });
        const sortedChats = chats.sort((a: any, b: any) => b.lastUpdated - a.lastUpdated);

        if (user) {
            res.status(200).send({ user: user, chats: sortedChats });
        }
        else {
            res.status(401).send({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export async function register(req: any, res: any) {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            throw new Error('Please fill all fields');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        return res.status(201).send({ message: "User registered successfully" });

    } catch (error: any) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
}

export async function login(req: any, res: any) {
    try {
        const { email, password } = req.body;

        if (!email || !password) throw new Error("Please fill all fields");

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Invalid email or password" });
        }

        if (!user.password) throw new Error("Invalid email or password");

        const match = await bcrypt.compare(password, user.password);
        console.log("is match", match)
        
        if (!match) {
            return res.status(400).send({ error: "Invalid email or password" });
        }

        const token = jwt.encode({ id: user._id, role: "user" }, secret);

        res.cookie('userId', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(200).send({ message: "Login successful" });

    } catch (error: any) {
        if (error.code = "11000") {
            res.status(400).send({ error: "user already exists" })
        }
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
}

export async function getChats(req: any, res: any) {
    const { userId } = req.userId;

    console.log("getChats", userId)

    try {
      const user = await UserModel.findById(userId).populate("chats");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user.chats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };