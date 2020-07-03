import express from 'express';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import todos from './routes/todos.js';
import { NotFoundError } from './errors.js';

mongoose.connect(
	process.env.MONGODB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	},
	(err) => {
		if (err) {
			throw err;
		} else {
			console.log(`Connected To Database...`);
		}
	}
);

const port = process.env.PORT || 6969;
const app = express();

app.use(express.json());
app.use('/auth', auth);
app.use('/todos', todos);

app.get('/', (req, res) => {
	res.redirect('https://patelmalav-todo-angular.netlify.app/');
	// server.close();
});

app.use(function (req, _res, next) {
	console.log(req.method);
	const err = new NotFoundError(req.path);
	next(err);
});

app.use(function (err, _req, res, _next) {
	console.log('⭕' + err.message);
	console.log('❌' + err.code);
	console.log(JSON.stringify(err));
	if (err.status) {
		return res.status(err.status).json({ error: err.message });
	} else {
		res.json(err);
	}
});

export const server = app.listen(port, () => {
	console.log(`Server Started @ http://localhost:${port}`);
});
