const RoomService = require("../../service/room.service")

const getRooms = async (req, res) => {
    const { query } = req;
    const capacity = query.capacity;
    try {
        const rooms = await RoomService.findRooms(capacity);
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const createRoom = async (req, res) => {
    const { body } = req;

    try {
        const room = await RoomService.createRoom(body);

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Also delete all associated reservations to the rooms
const deleteRoom = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        const room = await RoomService.deleteRoomAndReservations(id);
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
    body.updated_at = new Date();
    const id = params.id;

    try {
        const room = await RoomService.updateRoom(id, body);
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ error: `No Room found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


module.exports = {
    getRooms,
    createRoom,
    editRoom,
    deleteRoom
};
