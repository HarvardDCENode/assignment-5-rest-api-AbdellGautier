const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController');
const EventService = eventController.EventService;

router.use((req, res, next) => {
    res.set({
        // allow any domain, allow REST methods we've implemented
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
        // Set content-type for all api requests
        'Content-type': 'application/json'
    });
    if (req.method == 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// read
router.get('/', (req, res, next) => {
    EventService.list()
        .then((events) => {
            console.log(`API: List events: ${events}`);
            res.status(200);
            res.send(JSON.stringify(events));
        });
    console.log("placeholder")
});

// read
router.get('/:eventid', (req, res, next) => {
    console.log(`finding ${req.params.eventid}`);
    EventService.read(req.params.eventid)
        .then((event) => {
            console.log(`Found the event: ${event}`);
            res.status(200);
            res.send(JSON.stringify(event));
        }).catch((err) => {
            res.status(404);
            res.end();
        });
});

// update
router.put('/:eventid', (req, res, next) => {
    console.log(`putting ${req.params.eventid}`);
    let putdata = req.body;
    EventService.update(req.params.eventid, putdata)
        .then((updatedevent) => {
            res.status(200);
            res.send(JSON.stringify(updatedevent));
        }).catch((err) => {
            res.status(404);
            res.end();
        });
});

// create
router.post('/', async (req, res, next) => {

    const event = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    }

    try {
        console.log(event);
        const eventSave = await EventService.create(event);
        res.status(201);
        res.send(JSON.stringify(eventSave));
    } catch (err) {
        console.log(err);
        throw new Error("EventSaveError", event);
    }
});

// delete
router.delete('/:eventid', (req, res, next) => {
    let id = req.params.eventid;
    EventService.delete(req.params.eventid)
        .then((event) => {
            console.log(`Deleted event: ${id}`);
            res.status(200);
            res.send(JSON.stringify(event));
        }).catch((err) => {
            res.status(404);
            res.end();
        });;
});

// error
router.use(function (err, req, res, next) {
    console.error(err);
    res.status(500);
    res.end();
});

module.exports = router;