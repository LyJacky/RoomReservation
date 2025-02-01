const Room = require('./room.model');

const getRooms = async (req, res) => {
    const { query } = req;
    const capacity = query.capacity;
    let filter = {};
    if (capacity) {
        filter = { ...filter, capacity: { $gte: capacity } }
    }
    try {
        const rooms = await Room.find(filter);
        console.log(Room)
        console.log(rooms)
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const createRoom = async (req, res) => {
    const { body } = req;

    try {
        // remove created and allow model to apply default
        // delete body.created;
        console.log(body)
        const roomDoc = new Room(body);
        const room = await roomDoc.save();

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// need to also delete all associated reservations to the rooms
// if we add user we need to delete all the users associated to that room as well, as well as their reservations
const deleteRoom = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        const room = await Room.findOneAndDelete({ _id: id });

        if (room) {
            res.json({ message: 'success', room: id });
        } else {
            res.status(404).json({ error: `No room found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
const editRoom = async (req, res) => {
    const { params, body } = req;
    console.log(body.updated_at)
    body.updated_at = new Date();
    console.log(body.updated_at)
    const id = params.id;
    console.log(body);
    console.log("THE ID IS ", id)

    try {
        const room = await Room.findOneAndUpdate({ _id: id }, body, {
            new: true
        });

        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ error: `No Room found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
// const checkData = async () => {
//     const rooms = await Room.find();
//     console.log('Rooms:', rooms);
// };
// checkData();

module.exports = {
    getRooms,
    createRoom,
    editRoom,
    deleteRoom
};
