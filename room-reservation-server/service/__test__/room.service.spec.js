const RoomService = require('../room.service');
const RoomRepository = require('../../repository/room.repository');

jest.mock('../../repository/room.repository');

describe('ReservationService', () => {
    let roomService;

    beforeEach(() => {
        roomService = RoomService;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findRooms', () => {
        it('should return rooms for a given the capacity', async () => {
            const mockRooms = [
                { id: 1, name: 'room 1', description: 'Room for work', capacity: 1 },
                { id: 2, name: 'room 2', description: 'Room for studying', capacity: 2 }
            ];
            RoomRepository.search.mockResolvedValue(mockRooms);

            const rooms = await roomService.findRooms(1);

            expect(rooms).toEqual(mockRooms);
            expect(RoomRepository.search).toHaveBeenCalledWith(1);
        });

        it('should throw an error if RoomRepository.search throws an error', async () => {
            const errorMessage = 'Database error';
            RoomRepository.search.mockRejectedValue(new Error(errorMessage));
            await expect(roomService.findRooms(1)).rejects.toThrow(errorMessage);
        });
    });

    describe('deleteRoomAndReservations', () => {
        it('should return the deleted room', async () => {
            const mockRoom = [
                { id: 1, name: 'room 1', description: 'Room for work', capacity: 1 }
            ];
            RoomRepository.findById.mockResolvedValue(mockRoom);
            RoomRepository.deleteById.mockResolvedValue(mockRoom);
            const room = await roomService.deleteRoomAndReservations(1);
            expect(room).toEqual(mockRoom);
            expect(RoomRepository.findById).toHaveBeenCalledWith(1);
            expect(RoomRepository.deleteById).toHaveBeenCalledWith(1);
        });

        it('should throw an error if RoomRepository.search throws an error', async () => {
            const errorMessage = 'Error: room not found';
            mockRoom = null
            RoomRepository.findById.mockResolvedValue(mockRoom);
            await expect(roomService.deleteRoomAndReservations(1)).rejects.toThrow(errorMessage);
        });
    });

    describe('createRoom', () => {
        it('should return the created room', async () => {
            const mockRoom = { id: 1, name: 'room 1', description: 'Room for work', capacity: 1 };
            const findResult = []
            RoomRepository.search.mockResolvedValue(findResult);
            RoomRepository.createRoom.mockResolvedValue(mockRoom);
            const room = await roomService.createRoom(mockRoom);
            expect(room).toEqual(mockRoom);
            expect(RoomRepository.search).toHaveBeenCalledWith(null, mockRoom.name);
            expect(RoomRepository.createRoom).toHaveBeenCalledWith(mockRoom);
        });

        it('should throw an error if RoomRepository.search throws an error', async () => {
            const errorMessage = 'Error: There exists a room with the same name already';
            const mockRoom = { id: 1, name: 'room 1', description: 'Room for work', capacity: 1 };
            RoomRepository.search.mockResolvedValue(mockRoom);
            await expect(roomService.createRoom(mockRoom)).rejects.toThrow(errorMessage);
        });
    });
    describe('updateRoom', () => {
        it('should return the created room', async () => {
            const mockData = { name: 'room 1', description: 'Room for work', capacity: 1 };
            const mockRoom = { _id: 1, name: 'room 1', description: 'Room for work', capacity: 1 };
            const id = 1
            const findResult = [{ _id: 1, name: 'room 1', description: 'Room for work', capacity: 1 }]
            RoomRepository.findById.mockResolvedValue(id);
            RoomRepository.search.mockResolvedValue(findResult);
            RoomRepository.update.mockResolvedValue(mockRoom);
            const room = await roomService.updateRoom(id, mockData);
            expect(room).toEqual(mockRoom);
            expect(RoomRepository.search).toHaveBeenCalledWith(null, mockRoom.name);
            expect(RoomRepository.update).toHaveBeenCalledWith(id, mockData);
        });

        it('should throw an error if RoomRepository.search throws an error', async () => {
            const errorMessage = 'Error: room not found';
            const id = 1
            const mockData = { name: 'room 1', description: 'Room for work', capacity: 1 };

            const mockRoom = null;
            RoomRepository.findById.mockResolvedValue(mockRoom);
            await expect(roomService.updateRoom(id, mockData)).rejects.toThrow(errorMessage);
        });
    });
});
