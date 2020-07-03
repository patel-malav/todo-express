import express from 'express';
import jwt from 'express-jwt';
import _ from 'lodash';
import Todo from '../models/todo.js';
import { MethodNotSupportedError } from '../errors.js';

const todos = express
	.Router()
	.use(jwt({ secret: process.env.SECRET, algorithms: ['HS256'] }));

/**
 * @route All Todos
 */
todos
	.route('/')
	.get(async (req, res) => {
		const allTodos = await Todo.find({
			user: req.user.id,
		}).exec();
		return res.json(allTodos);
	})
	.post(async (req, res) => {
		const newTodo = new Todo({
			user: req.user.id,
			...req.body,
		});
		const savedTodos = await newTodo.save();
		return res.json(savedTodos);
	})
	.all((req, _res) => {
		throw new MethodNotSupportedError(req.method, req.originalUrl);
	});

/**
 * @route Specific Todo
 */
todos
	.route('/:todoId')
	.get(async (req, res) => {
		const savedTodo = await Todo.findById(req.params.todoId).exec();
		return res.json(savedTodo);
	})
	.put(async (req, res) => {
		const updatedTodo = await Todo.findByIdAndUpdate(
			req.params.todoId,
			req.body,
			{ new: true }
		).exec();
		return res.json(updatedTodo);
	})
	.delete(async (req, res) => {
		const confirmation = await Todo.findByIdAndDelete(
			req.params.todoId
		).exec();
		return res.json(confirmation);
	})
	.all((req, _res) => {
		throw new MethodNotSupportedError(req.method, req.originalUrl);
	});

/**
 * @route Tasks
 */
todos
	.route('/:todoId/tasks')
	.get(async (req, res) => {
		const selectedTodo = await Todo.findById(req.params.todoId)
			.select('tasks')
			.exec();
		res.json(selectedTodo.tasks);
	})
	.post(async (req, res) => {
		const updatedTodo = await Todo.findByIdAndUpdate(
			req.params.todoId,
			{
				$push: { tasks: req.body },
			},
			{ new: true }
		)
			.select('tasks')
			.exec();
		res.json(updatedTodo.tasks);
	})
	.all((req, _res) => {
		throw new MethodNotSupportedError(req.method, req.originalUrl);
	});

/**
 * @route Specific Task
 */
todos
	.route('/:todoId/tasks/:taskId')
	.get(async (req, res) => {
		const selectedTodo = await Todo.findById(req.params.todoId)
			.select('tasks')
			.exec();
		const task = selectedTodo.tasks.find(
			(task) => task.id.toString() === req.params.taskId
		);
		res.json(task);
	})
	.put(async (req, res) => {
		const selectedTodo = await Todo.findById(req.params.todoId)
			.select('tasks')
			.exec();
		const task = selectedTodo.tasks.find(
			(task) => task.id.toString() === req.params.taskId
		);
		Object.assign(task, req.body);
		const updatedTodo = await selectedTodo.save();
		res.json(updatedTodo.tasks);
	})
	.delete(async (req, res) => {
		const updatedTodo = await Todo.findByIdAndUpdate(
			req.params.todoId,
			{
				$pull: { tasks: { _id: req.params.taskId } },
			},
			{ new: true }
		)
			.select('tasks')
			.exec();
		return res.json(updatedTodo.tasks);
	})
	.all((req, _res) => {
		throw new MethodNotSupportedError(req.method, req.originalUrl);
	});

export default todos;
