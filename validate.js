import Validator from 'validator';
import bcrpyt from 'bcrypt';
import User from './models/user.js';

export async function login({ email, password }) {
	const errors = {};
	if (!errors.password && Validator.isEmpty(password)) {
		errors.password = 'Password field is required';
	}
	if (
		!errors.password &&
		!Validator.isLength(password, { min: 6, max: 30 })
	) {
		errors.password = 'Password must be between 6 and 30 characters';
	}
	if (!errors.email && Validator.isEmpty(email)) {
		errors.email = 'Email field is required';
	}
	if (!errors.email && !Validator.isEmail(email)) {
		errors.email = 'Email is invalid';
	}
	let user;
	if (!errors.password && !errors.email) {
		user = await User.findOne({ email }).exec();
		if (!user) {
			errors.email = 'Email does not exists';
		}
		if (user && !(await bcrpyt.compare(password, user.password))) {
			errors.email = 'Password is wrong';
		}
	}
	return {
		user,
		errors,
		isValid: Object.keys(errors).length === 0,
	};
}

export async function register({ name, email, password }) {
	const errors = {};
	let user;

	if (!Validator.isLength(name, { min: 3, max: 128 })) {
		errors.name = 'Name must be between 2 and 128 characters';
	}

	if (Validator.isEmpty(name)) {
		errors.name = 'Name field is required';
	}

	if (Validator.isEmpty(email)) {
		errors.email = 'Email field is required';
	}

	if (!Validator.isEmail(email)) {
		errors.email = 'Email is invalid';
	}

	if (!errors.email) {
		user = User.findOne({ email }).exec();
	}

	if (Validator.isEmpty(password)) {
		errors.password = 'Password field is required';
	}

	if (!Validator.isLength(password, { min: 6, max: 30 })) {
		errors.password = 'Password must be between 6 and 30 characters';
	}
	// if (Validator.isEmpty(password2)) {
	// 	errors.password2 = 'Confirm password field is required';
	// }
	// if (!Validator.equals(password, password2)) {
	// 	errors.password2 = 'Passwords must match';
	// }

	if (await user) {
		// console.log(user);
		errors.email = 'Email already exists';
	}

	return {
		errors,
		isValid: Object.keys(errors).length === 0,
	};
}

export default { register, login };
