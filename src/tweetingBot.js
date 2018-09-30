const Twit = require('twit')
const config = require('./config')

const bot = new Twit(config)

const retweet = require('./api/retweet')

const isReply = require('./helpers/isReply')

let tweets = []

const addTweetToQueue = e => {
  if (isReply(e)) {
    // eslint-disable-next-line no-console
    console.log('====================')
    // eslint-disable-next-line no-console
    console.log(`=IS REPLY RETURNING=`)
  
    console.log('====================')
    return
  }
  tweets.push({
    tweet: e.text,
    tweetId: e.id_str,
    user: e.user.screen_name,
    timeIn: new Date(newTimeIn()),
    timeOut: new Date(newTimeOut()),
    event: e // EVERYTHING!!!
  })
  console.log(`Item added to queue, current length=${tweets.length}`)
}

console.log('tweetlist: ', tweets)
/*
bot.post('statuses/update', {
  status: "Hello World!"
}, (err, data, response) => {
  if (err) {
    console.log(err)
  }else{
    console.log(`${data.text} tweeted!`)
  }
})
*/

bot.get('followers/list', {
  screen_name: '100joursdecode',
  count: 200
}, (err, data, response) => {
  if (err) {
    console.log(err)
  } else {
    data.users.forEach(user => {
      console.log(user.screen_name)
    })
  }
})
