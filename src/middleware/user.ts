import { NextFunction, Request, Response } from "express"
import User from "../entity/User"
import jwt from 'jsonwebtoken'

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token
        if(!token) return next()

        const secret: any = process.env.JWT_SECRET
        const { username }: any = jwt.verify(token, secret)

        var user = await User.findOne({ username })

        if(!user) user = await User.findOne({ email: username })

        res.locals.user = user

        return next()
    } catch (err) {
        res.status(401).json({ error: err.message })
    }
}
