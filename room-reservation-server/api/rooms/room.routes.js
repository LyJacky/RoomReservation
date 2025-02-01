const router = require('express').Router();

const controller = require('./room.controller');

// GET /rooms
router.get('/', controller.getRooms);
// POST /rooms
router.post('/', controller.createRoom);
// PUT /rooms/:id
router.put('/:id', controller.editRoom);
// DELETE /rooms/:id
router.delete('/:id', controller.deleteRoom);

module.exports = router;