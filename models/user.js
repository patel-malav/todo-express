import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 128,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			minlength: 6,
			maxlength: 128,
		},
		password: {
			type: String,
			required: true,
			minlength: 50,
			maxlength: 104,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('User', userSchema);
