import { Router } from "express";
import { todoController } from "./todo.controller";

const router = Router();

router.post("/", todoController.createTodo);

router.get("/", todoController.getTodos);

export const todoRouter = router;