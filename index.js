const TelegramBot = require('node-telegram-bot-api')
const TG_TOKEN = '269653246:AAFp9-NzZUc03C6VPGjlZOp_PlttWvUEzRo'

let tgBot = new TelegramBot(TG_TOKEN, { polling: true })

tgBot.on('text', msg => {
    traceMsg(msg)
    tgBot.sendMessage(msg.chat.id, `ага`)
})


function traceMsg(msg) {
    console.log(msg)
    console.log('\n =====-----===== \n')
}