import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
			lowercase: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

taskSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (_doc, ret) => {
		delete ret._id;
	},
});

const todoSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
			lowercase: true,
		},
		tasks: {
			type: [taskSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

todoSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (_doc, ret) => {
		delete ret._id;
	},
});

export default mongoose.model('Todo', todoSchema);
