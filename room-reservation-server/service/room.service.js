const RoomRepository = require('../repository/room.repository');

class RoomService {
    async findRooms(capacity) {
        try {
            if (capacity !== undefined && capacity <= 0) {
                throw new Error("Error: capacity must be greater than 0");
            }
            return await RoomRepository.search(capacity);
        } catch (err) {
            throw err;
        }
    }

    async deleteRoomAndReservations(roomId) {
        try {
            const room = await RoomRepository.findById(roomId);
            if (!room) {
                throw new Error('Error: room not found');
            }
            const deletedRoom = await RoomRepository.deleteById(roomId);
            return deletedRoom
        } catch (err) {
            throw new Error(err);
        }

    }

    async createRoom(roomData) {
        try {
            if (!roomData.name || !roomData.description) {
                throw new Error(' Error: Missing information for room');
            }
            const verifyRoom = await RoomRepository.search(null, roomData.name)
            if (verifyRoom.length != 0) {
                throw new Error('Error: There exists a room with the same name already');
            }
            const room = await RoomRepository.createRoom(roomData);
            return room
        } catch (err) {
            throw new Error(err.message);
        }

    }

    async updateRoom(roomId, roomData) {
        try {
            const room = await RoomRepository.findById(roomId);
            if (!room) {
                throw new Error('Error: room not found');
            }
            const verifyRoom = await RoomRepository.search(null, roomData.name)
            // The database is already going to have unique names, so we will just find 1
            if (verifyRoom.length == 1) {
                if (verifyRoom[0]._id.toString() != roomId) {
                    throw new Error('Error: There exists a room with the same name already');
                }
            }
            const updatedRoom = await RoomRepository.update(roomId, roomData);
            return updatedRoom
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new RoomService();

