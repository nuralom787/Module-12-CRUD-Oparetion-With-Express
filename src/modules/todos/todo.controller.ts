import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try {
        const result = await todoServices.createTodo(user_id, title);

        res.status(200).json({
            success: true,
            message: "Todo Created.",
            data: result.rows[0]
        })
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getTodos = async (req: Request, res: Response) => {
    try {
        const result = await todoServices.getTodos();
        res.status(200).json({
            success: true,
            message: "Todos retrieved Successfully!",
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
}


export const todoController = {
    createTodo,
    getTodos,
};