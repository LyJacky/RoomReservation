const Room = require('../model/room.model');

class RoomRepository {
    async search(capacity, name) {
        let filter = {};
        if (capacity) {
            filter.capacity = { $gte: capacity };
        } else {
            filter.capacity = { $gte: 1 };
        }
        if (name) {
            filter.name = name;
        }
        return await Room.find(filter);
    }
    async findById(id) {
        return await Room.findById(id)
    }

    async deleteById(id) {
        return await Room.findOneAndDelete({ _id: id })
    }

    async update(id, data) {
        const room = await Room.findOneAndUpdate({ _id: id }, data, {
            new: true
        });
        return room;
    }
    async createRoom(data) {
        const roomDoc = new Room(data);
        const room = await roomDoc.save();
        return room;
    }
}

module.exports = new RoomRepository();
