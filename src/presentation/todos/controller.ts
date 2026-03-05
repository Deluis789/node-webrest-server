import { Request, Response } from "express";

const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() },
]

export class TodosController {

    constructor() { }

    public getTodos = (req: Request, resp: Response) => {
        resp.json(todos);
    }


    public getTodoById = (req: Request, resp: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return resp.status(400).json({ error: 'ID argument is not a number' });

        const todo = todos.find(todo => todo.id === id);

        (todo)
            ? resp.json(todo)
            : resp.status(404).json({ error: `TODO with id ${id} not found` });
    }

    public createTodo = (req: Request, resp: Response) => {
        const { text } = req.body;
        if (!text) return resp.status(400).json({ error: 'Text property is required' });

        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: null,
        }

        todos.push(newTodo);

        resp.json(newTodo);
    }

    public updateTodo = (req: Request, resp: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return resp.status(400).json({ error: 'ID argument is not a number' });

        const todo = todos.find(todo => todo.id === id);
        if (!todo) return resp.status(404).json({ error: `Todo with id ${id} not found` });

        const { text, completedAt } = req.body;

        todo.text = text || todo.text;
        (completedAt === 'null')
            ? todo.completedAt = null
            : todo.completedAt = new Date(completedAt || todo.completedAt);

        resp.json(todo);
    }

    public deleteTodo = (req: Request, resp: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return resp.status(400).json({ error: 'ID argument is not a number' });

        const todo = todos.find(todo => todo.id === id);
        if (!todo) return resp.status(404).json({ error: `Todo with id ${id} not found` });

        todos.splice(todos.indexOf(todo), 1);

        resp.json(todo);

    }

}