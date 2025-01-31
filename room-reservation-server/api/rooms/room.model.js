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
    // { 
    //     toObject: { virtuals: true },
    //     toJSON: { virtuals: true }
    // }
); 

// Define a virtual property to retrieve bookmarks associated with the snippet
RoomSchema.virtual('reservation', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'room_id'
});

// .post to delete associated bookmarks when a snippet is deleted
// doc argument refers to the deleted snippet document
RoomSchema.post('findOneAndDelete', async function (doc) {
    const Reservation = mongoose.model('reservation');

    try {
        // delete all bookmarks associated with the removed snippet
        await Reservation.deleteMany({ room_id: doc._id });
    } catch (error) {
        console.log(error);
    }
});



const Room = mongoose.model('Rooms', RoomSchema);
 
module.exports = Room;