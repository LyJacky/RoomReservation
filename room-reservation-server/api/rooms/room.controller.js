const Room = require('./room.model');

const getRooms = async (req, res) => {
    const { query } = req;
    console.log('I WENT INSIDE HERE')
    console.log(query)
    let filter = {};
    // if (language) {
    //     filter = {
    //         programming_language: { $regex: language, $options: 'i' }
    //     };
    // }

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
    const { query } = req;
    console.log('I WENT INSIDE HERE')
    console.log(query)
    let filter = {};
    // if (language) {
    //     filter = {
    //         programming_language: { $regex: language, $options: 'i' }
    //     };
    // }

    try {
        const rooms = await Room.find(filter);
        console.log(Room)
        console.log(rooms)
        res.json(rooms);
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
    createRoom
};
 