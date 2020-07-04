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

		const { id, name } = user;
		const payload = { id, name };
		const token = new Promise((resolve, reject) =>
			jwt.sign(
				payload,
				process.env.SECRET,
				{ expiresIn: 86400 },
				(error, token) => (error ? reject(error) : resolve(token))
			)
		);
		return res.json({ token: await token });
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
		if (savedUser._id) {
			return res.json({ ok: 'registered' });
		} else {
			throw 'Database Error';
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
