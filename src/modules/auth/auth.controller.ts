import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authServices.loginUser(email, password);

    try {
        res.status(200).json({
            success: true,
            message: "Login Successfully.",
            data: result
        });
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    };
};

export const authController = {
    loginUser,
};