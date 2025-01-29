const router = require('express').Router();

const controller = require('./reservation.controller');

// GET /reservations
router.get('/', controller.getReservations);
// GET /reservations/nonValid
router.get('/nonValid', controller.getNonValidReservations);
// POST /reservations
router.post('/', controller.createReservation);
// PUT/reservations/cancel
router.put('/cancelReservation', controller.cancelReservation);

module.exports = router;