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

const Room = mongoose.model('Rooms', RoomSchema);
 
module.exports = Room;