import express, { NextFunction, Request, Response } from "express";
import initDB, { pool } from "./config/db";
import { usersRoutes } from "./modules/users/user.routes";
import { todoRouter } from "./modules/todos/todo.routes";
import { authRouter } from "./modules/auth/auth.route";

const app = express();

// ? Parser
app.use(express.json());
app.use(express.urlencoded()); // * Using For Getting Form Data In Body.


initDB();


// * -----------------  Users Related APIS ------------------ *//

app.use("/users", usersRoutes);


// * --------------------- todos Related APIS ----------------------- * //

app.use("/todos", todoRouter);


// * --------------------- Auth Related APIS ----------------------- * //

app.use("/auth", authRouter);




// * Default Apis.

// ! Default get Route
app.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'Hello Node-express!' })
});


// ! ----------------------- NOT FOUND ---------------------- ! //

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found!",
        path: req.path
    })
});

export default app;
