const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            lowercase: true
        },
        description: String,
        capacity: Number,
        equipments: [Object],
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    },
);

// Define a virtual property to retrieve bookmarks associated with the snippet
RoomSchema.virtual('Reservation', {
    ref: 'reservations',
    localField: '_id',
    foreignField: 'room_id'
});

// .post to delete associated reservations when a room is deleted
RoomSchema.post('findOneAndDelete', async function (doc) {
    const Reservation = mongoose.model('Reservations');
    try {
        // delete all reservations associated with the removed room
        await Reservation.deleteMany({ room_id: doc._id });
    } catch (error) {
        console.log(error);
    }
});



const Room = mongoose.model('Rooms', RoomSchema);

module.exports = Room;