const TelegramBot = require('node-telegram-bot-api');
const TG_TOKEN = ';;;;;';

let tgBot = new TelegramBot(TG_TOKEN, { polling: true });


var event = {};


tgBot.on('text', (msg) => {

    traceMsg(msg);

    if (msg.text.match(/\/new/)) {
        addNewEvent(msg)
    }

    else if (event.waitForLabel) {
        addNewEvent(msg)
    }

    else if (event.waitForPossibleDays) {
        if (msg.text.match(/\/end/)) {
            event.waitForPossibleDays = false
            return
        }
        addPossibleEventDay(msg)
    }

    else if (msg.text.match(/\/eventStats/)) {
        getEventResults(msg)

    }

});

function addNewEvent(msg) {


    if (event.waitForLabel) {
        event.label = msg.text
        event.waitForLabel = false
        let reply = `Okay, lets add possible days for '${event.label}'.\nSend options.`
        tgBot.sendMessage(msg.chat.id, reply)
            .then(function () {

                event.waitForPossibleDays = true
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
        id: msg.message_id,
        participants: 1
    })

    let reply = `Okay, you added next days for '${event.label}':\n`

    event.possibleDays.forEach((item) => {
        reply += `🎈${item.name}\n`
    })

    reply += 'Send more options or \'/end\' to complete the list';
    let keyboard = {

    }
    tgBot.sendMessage(msg.chat.id, reply, keyboard)
}

function getEventResults(msg) {
    let reply = `So, for this moment on ⚠️${event.label}⚠️ band are ready at\n`

    event.possibleDays.forEach((item) => {
        reply += `🎈${item.name} - ${item.participants} people(s)\n`
    })

    tgBot.sendMessage(msg.chat.id, reply)
}

function addMyDay() {

}



function traceMsg(msg) {
    console.log(msg);
    console.log('\n =====-----===== \n')
}