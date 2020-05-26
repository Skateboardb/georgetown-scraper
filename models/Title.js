const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const titleSchema = new Schema(
	{
		title: {
			type: String,
			required: true
        },
        edition: {
            type: String,
            required: false
        },
		link: {
			type: String,
			required: true
        },
        category:{
            type: String,
            required: true
        }
	
	},
	{
		toObject: {
			virtuals: true
		},
		toJSON: {
			virtuals: true
		}
	}
);
const Title = mongoose.model('Title', titleSchema);
module.exports = Title;
