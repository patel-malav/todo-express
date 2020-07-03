import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import validate from '../validate.js';

const router = express.Router();

router.route('/login').post(async (req, res) => {
	try {
		const { errors, isValid, user } = await validate.login(req.body);
		if (!isValid) return res.status(400).json(errors);

		const payload = { id: user.id, name: user.name };
		const token = new Promise((resolve, reject) =>
			jwt.sign(
				payload,
				process.env.SECRET,
				// { expiresIn: 3600 },
				(error, token) => (error ? reject(error) : resolve(token))
			)
		);
		res.json({ ...user.toJSON(), token: await token });
	} catch (error) {
		console.log(error);
		return res.send(500).json({ error: 'Internal Server Error' });
	}
});

router.route('/register').post(async (req, res) => {
	try {
		// Validate Request Body Data
		const { errors, isValid } = await validate.register(req.body);
		if (!isValid) return res.status(400).json(errors);

		// Add User to database
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			// Hash the password
			password: await bcrypt.hash(req.body.password, 10),
		});
		const savedUser = await user.save();

		// Respond with saved data
		res.json(savedUser);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
