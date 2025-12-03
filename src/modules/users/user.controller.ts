import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.createUser(req.body);

        res.status(200).json({
            success: true,
            message: 'Data inserted Successfully!',
            data: result.rows[0]
        });
    }
    catch (err: any) {
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();

        res.status(200).json({
            success: true,
            message: "Users retrieved Successfully!",
            data: result.rows
        })
    }
    catch (err: any) {
        // console.log(err);    
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getSingleUser(req.params.id!);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "user Founded",
                data: result.rows
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const result = await userServices.updateUser(name, email, req.params.id!);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
        }
        else {
            res.status(200).json({
                success: false,
                message: "user Updated Successfully",
                data: result.rows
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.id!);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "user Deleted Successfully.",
                data: result.rows
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
};

export const userController = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
};