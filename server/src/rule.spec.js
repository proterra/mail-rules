let msg = {
    '#': 498,
    uid: 5230,
    flags: ["\Seen"],
    envelope: {
        date: "Sun, 30 Dec 2018 20:44:38 +0000",
        subject: "[WinchesterUK] OFFER: Bags of rubble/ bricks (Oakley )",
        from: [
            {
                address: "email_relay@freecycle.org",
                name: "Ireuseit via The Freecycle Network"
            }
        ],
        sender: [
            {
                address: "email_relay@freecycle.org",
                name: "My Freecycle"
            }
        ],
        'reply-to': [
            {
                address: "69899840@posts.freecycle.org",
                name: ""
            }
        ],
        to: [
            {
                address: "callanais@gmail.com",
                name: "mbw2014"
            }
        ],
        'message-id': "<E1gdhxC-0007fm-TW@vps109.frk.freecycle.org>"
    }
};

const Engine = require('json-rules-engine').default;
let engine = new Engine({msg})

engine.addRule({
    conditions: {
        any: [{
            fact: 'msg',
            operator: 'equal',
            value: 'email_relay@freecycle.org',
            path:'.envelope.sender[0].address'
        }]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'move',
        params: {
            dest: 'freecycle'
        }
    }
  })

engine
    .run()
    .then(events => { // run() returns events with truthy conditions
        events.map(event => console.log(event.params.message))
    })