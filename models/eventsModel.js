const mongoose = require('mongoose');

// Get access to Schema constructor
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

eventSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('events', eventSchema);