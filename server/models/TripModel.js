// server/models/TripModel.js

const mongoose = require('mongoose');

const itineraryItemSchema = mongoose.Schema({
    activity: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    time: {
        type: Date, // Date and time for the specific activity
    },
    estimatedCost: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
    },
});

const tripSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please give the trip a name.'],
            trim: true,
        },
        destination: {
            type: String,
            required: [true, 'Please specify the main destination.'],
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        // Link the trip owner to the User model
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // List of users who can edit/view the trip (collaborative feature)
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                role: {
                    type: String,
                    enum: ['owner', 'editor', 'viewer'],
                    default: 'viewer',
                },
            },
        ],
        // The core itinerary structured as an array of items
        itinerary: [itineraryItemSchema],

        // Budget tracking
        totalBudget: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: 'USD',
        },
    },
    {
        timestamps: true,
    }
);

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;