const TelegramBot = require('node-telegram-bot-api');
const TG_TOKEN = require('./token');

let tgBot = new TelegramBot(TG_TOKEN, { polling: true });


let event = {};


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
            event.waitForPossibleDays = true;
            event.possibleDays = [];
            let reply = '✍🏼 send possible days for event, every option separately 💬';
            tgBot.sendMessage(msg.chat.id, reply)

        } else {

            let reply = '👋🏼 please enter label of new event you would like to plan ⤵️';
            tgBot.sendMessage(msg.chat.id, reply);
            event.waitForLabel = true

        }



}

function addPossibleEventDay(msg) {
    event.possibleDays.push({
        name: msg.text,
        id: Number(msg.message_id),
        participants: [msg.from.id]
    });

    let reply = `💁🏼‍♂️ available days for '${event.label} ⤵️\n`;
    // let keyboard = [];
    event.possibleDays.forEach((item) => {
        reply += `🔘${item.name}, if it day fits for you ➡️ /${item.id}\n`
        // keyboard.push({text: item.name})
    });

    reply += '👌🏼 send more options or \'/end\' to complete the list💪🏼';

    tgBot.sendMessage(msg.chat.id, reply )
}

function getEventResults(msg) {
    let reply = '';
    if (event.label) {
        reply = `🤓at now ${event.label} had participians:\n`;

        event.possibleDays.forEach((item) => {
            reply += `👉🏼${item.name} - ${item.participants.length} partipicipians\n`
        });
    } else {
        reply = '💩 no event presented, /new to create one!'
    }

    tgBot.sendMessage(msg.chat.id, reply)
}

function addMyDay(msg) {
    const id = Number(msg.text.split('/')[1]),
        who = msg.from.id;

    let reply = '';

    event.possibleDays.forEach((item) => {

        if (item.id === id && item.participants.indexOf(who) < 0) {

            item.participants.push(who);
            reply = `${msg.from.first_name + ' ' + msg.from.last_name} is okay on ${item.name} ☝🏼`

        }

        else if (item.id === id && item.participants.indexOf(who) >= 0) {

            reply = `Hey ${msg.from.first_name + ' ' + msg.from.last_name}, u already voted for ${item.name} 👌🏼`

        }
    });

    if (reply.length) tgBot.sendMessage(msg.chat.id, reply)

}
//
// function traceMsg(msg) {
//     console.log(msg);
//     console.log('\n =====-----===== \n')
// }