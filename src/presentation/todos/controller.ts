import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { error } from "console";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

export class TodosController {

    constructor() { }

    public getTodos = async (req: Request, resp: Response) => {
        const todos = await prisma.todo.findMany();
        resp.json(todos)
    }


    public getTodoById = async (req: Request, resp: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return resp.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findUnique({ where: { id } });

        (todo)
            ? resp.json(todo)
            : resp.status(404).json({ error: `TODO with id ${id} not found` });
    }

    public createTodo = async (req: Request, resp: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return resp.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        resp.json(todo);
    }

    public updateTodo = async (req: Request, resp: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id })

        if (error) return resp.status(400).json({ error });

        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) return resp.status(404).json({ error: `Todo with id ${id} not found` });

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        })

        resp.json(updatedTodo);
    }

    public deleteTodo = async (req: Request, resp: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return resp.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) return resp.status(404).json({ error: `Todo with id ${id} not found` });
        const deleteT = await prisma.todo.delete({ where: { id } });

        (deleteT)
            ? resp.json(deleteT) : resp.status(404).json({ error: `Todo with id: ${id} not found` })
    }

}