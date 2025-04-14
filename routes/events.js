const express = require('express');
const router = express.Router();
const event = require('../models/eventsModel');

// Show the events list
router.get('/', (req, res, next) => {

    event.find({})
        .sort({ date: 1 })
        .then((events) => {
            res.render('events/index', {
                events: events
            });
        })
        .catch((err) => {
            if (err) {
                console.error("Error fetching events from the database:", err);
                res.status(500).send(err);
            }
        });
});

// Show the Add New Event page
router.get('/add', (req, res, next) => {
    res.render('events/add');
});

// Save the new event
router.post('/add', (req, res, next) => {

    const eventData = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    }

    const newEvent = new event(eventData);

    newEvent.save()
        .then(() => {
            res.redirect('/events');
        })
        .catch((err) => {
            if (err) {
                console.log(err);
                throw new Error("EventSaveError", event);
            }
        });
});

// Show the edit event page
router.get('/edit/:eventid', (req, res, next) => {

    event.findOne({ '_id': req.params.eventid })
        .then((event) => {
            res.render('events/edit', {
                event: event,
                eventDate: event.date.getFullYear() + "-" + String(event.date.getMonth() + 1).padStart(2, 0) + "-" + String(event.date.getDate()).padStart(2, 0)
            });
        })
        .catch((err) => {
            if (err) {
                res.end("ERROR!");
            }
        });
});

// Perform the update on an edited event
router.post('/update', (req, res, next) => {

    event.findByIdAndUpdate(req.body.eventId)
        .then((existingEvent) => {
            var data = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date
            }
            existingEvent.set(data);
            existingEvent.save().then(() => {
                res.redirect('/events');
            });
        })
        .catch((err) => {
            if (err) {
                console.log(err);

                res.end("Error updating the event!");
            }
        });
});

// Delete an event
router.post('/delete', (req, res, next) => {

    event.findByIdAndDelete(req.body.eventId)
        .then(() => {
            res.redirect('/events');
        })
        .catch((err) => {
            if (err) {
                res.end("Delete event error!");
            }
        });
});

module.exports = router;