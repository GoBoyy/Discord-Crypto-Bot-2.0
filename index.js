//Author: Owen Parsons
//Date: 12/9/2020
const prefix = '.price '
const axios = require('axios')
const cheerio = require('cheerio')
const Discord = require('discord.js')
const client = new Discord.Client()
const token = '(discord bot token)'

function parseHTML(html) {
    // getting price
    const $ = cheerio.load(html)
    const price = $('.coin-price').children()[1].children[0].data

    // checking if valid
    if(price.length > 20)
        return false

    return price
}

function getPrice(ticker) {
    return new Promise((resolve, reject) => {
        const api = `https://cryptoprices.com/cryptocurrency/${ticker}/`

        // getting html from website
        axios.get(api)
            .then(html => {
                // getting price and returning
                const price = parseHTML(html.data)

                if(!price) reject()
                else resolve(price)
            })
            .catch(err => console.log('Something went wrong, try again!\n', err))
    })
}

client.on('message', event => {
    const { content } = event

    if(content.indexOf(prefix) === 0) {
        let ticker = content.split(' ')[1]

        getPrice(ticker)
            .then(price => {
                event.channel.send(`The price of ${ticker} is $${price}`)
            })
            .catch(() => {
                event.channel.send('Something went wrong, example `.price bitcoin`')
            })
    }
})

client.login(token)
    .then(() => console.log('Bot logged in!'))
    .catch(() => console.log('Your token is probably wrong! Failed!'))
