const Event = require('../models/eventsModel');

class EventService {

    static create(obj) {
        const event = new Event(obj);
        return event.save();
    }

    static update(id, data) {
        return Event.findById(id)
            .then((event) => {
                event.set(data);
                event.save();
                return event;
            });
    }

    static read(id) {
        return Event.findById(id)
            .then((event) => {
                // found
                return event;
            });
    }

    static list() {
        return Event.find({})
            .then((events) => {
                // found
                return events;
            });
    }

    static delete(id) {
        return Event.deleteOne({ _id: id })
            .then((obj) => {
                //removed
                return obj;
            })
    }
}

module.exports.EventService = EventService;