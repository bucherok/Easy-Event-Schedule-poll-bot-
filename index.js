const TelegramBot = require('node-telegram-bot-api');
const TG_TOKEN = require('./token');

let tgBot = new TelegramBot(TG_TOKEN, { polling: true });


var event = {};


tgBot.on('text', (msg) => {

    if (msg.text.match(/\/new/)) {
        addNewEvent(msg)
    }

    else if (event.waitForLabel) {
        addNewEvent(msg)
    }

    else if (event.waitForPossibleDays) {
        if (msg.text.match(/\/end/)) {
            event.waitForPossibleDays = false;
            return
        }
        addPossibleEventDay(msg)
    }

    else if (msg.text.match(/\/eventStats/)) {
        getEventResults(msg)

    }

    else if (msg.text.match(/\/\d+/)) {
        addMyDay(msg)
    }
});

function addNewEvent(msg) {


    if (event.waitForLabel) {
        event.label = msg.text;
        event.waitForLabel = false;
        let reply = `Okay, lets add possible days for '${event.label}'.\nSend options.`;
        tgBot.sendMessage(msg.chat.id, reply)
            .then(function () {

                event.waitForPossibleDays = true;
                event.possibleDays = []

             })
    }
    else {
        let reply = 'Hi!\nPlease enter label of new event you would like to plan';
        tgBot.sendMessage(msg.chat.id, reply)
            .then(function () {

                event.waitForLabel = true

             })
    }

}

function addPossibleEventDay(msg) {
    event.possibleDays.push({
        name: msg.text,
        id: Number(msg.message_id),
        participants: [msg.from.id]
    });

    let reply = `Okay, you added next days for '${event.label}':\n`;
    let keyboard = []
    event.possibleDays.forEach((item) => {
        reply += `🎈${item.name}, for vote on this /${item.id}\n`
        // keyboard.push({text: item.name})
    });

    reply += 'Send more options or \'/end\' to complete the list';

    tgBot.sendMessage(msg.chat.id, reply )
}

function getEventResults(msg) {
    let reply = ''
    if (event.label) {
        reply = `So, for this moment on ⚠️${event.label}⚠️ band are ready at\n`;

        event.possibleDays.forEach((item) => {
            reply += `🎈${item.name} - ${item.participants.length} people(s)\n`
        });
    } else {
        reply = 'No event presented'
    }

    tgBot.sendMessage(msg.chat.id, reply)
}

function addMyDay(msg) {
    const id = Number(msg.text.split('/')[1]),
        who = msg.from.id
    let reply = ''

    traceMsg(msg.from)

    event.possibleDays.forEach((item) => {

        if (item.id === id && item.participants.indexOf(who) < 0) {

            item.participants.push(who)
            traceMsg(item.participants)
            reply = `(@${msg.from.id}) ${msg.from.name} voted for ${item.name}`

        }

        else if (item.id === id && item.participants.indexOf(who) >= 0) {

            reply = `Hey ${msg.from.first_name + ' ' + msg.from.last_name}, u already voted for ${item.name}!`

        }
    })

    traceMsg(reply)


    if (reply.length) tgBot.sendMessage(msg.chat.id, reply)


}



function traceMsg(msg) {
    console.log(msg);
    console.log('\n =====-----===== \n')
}