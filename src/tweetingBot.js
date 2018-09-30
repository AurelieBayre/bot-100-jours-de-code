const Twit = require('twit')
const config = require('./config')

const bot = new Twit(config)

const retweet = require('./api/retweet')

const isReply = require('./helpers/isReply')

let tweets = []

const addTweetToQueue = e => {
  if (isReply(e)) {

    console.log('====================')
    // eslint-disable-next-line no-console
    console.log(`=IS REPLY RETURNING=`)
  
    console.log('====================')
    return
  }
  /*
   as the bot wants to retweet to the French-speking community,
   and we don't want to overload the English-speaking community 
   with French content, we exclude tweets that target #100daysOfCode.
  */

  if (!e.text.contains('#100DaysOfCode')) {
    tweets.push({
      tweet: e.text,
      tweetId: e.id_str,
      user: e.user.screen_name,
      event: e
    })
    console.log(`Tweet ajouté à la file, longueur actuelle = ${tweets.length}`)
  }
}


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

const stream = bot.stream('statuses/filter', 
{track: '100joursdecode, 100JoursDeCode, 100DaysOfCode'})

stream.on('tweet', function (tweet) {
  console.log(tweet)
})

stream.on('tweet', addTweetToQueue)
