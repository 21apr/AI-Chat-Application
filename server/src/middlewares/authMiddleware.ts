import { NextFunction } from "express";
import { UserModel } from "./../models/users/UserModel";
import jwt from 'jwt-simple';

const secret = process.env.SECRET || "secret"

export async function checkUser(req: any, res: any, next: NextFunction) {
    try {
        const { userId } = req.cookies;

        if (!userId) return res.status(401).send({ error: "Unauthorized" })

        const { id } = jwt.decode(userId, secret);

        req.userId = id;

        const userDB = await UserModel.findById(id );

        if (!userDB) {
            res.status(401).send({ error: 'User not found' });
            return;
        }

        // req.user = userDB;

        next();



    } catch (error) {
        console.error(error);
        res.send(error);

    }
}