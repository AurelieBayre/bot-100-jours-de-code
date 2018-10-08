const Twit = require('twit')
const config = require('./config')

const bot = new Twit(config)

const isReply = require('./helpers/isReply')


bot.get(
  'followers/list',
  {
    screen_name: '100joursdecode',
    count: 200
  },
  (err, data, response) => {
    if (err) {
      console.log(err)
    } else {
      data.users.forEach(user => {
        console.log(user.screen_name)
      })
    }
  }
)

const retweetRecent = () => {
  bot.get(
    'search/tweets',
    {
      q: '#100JoursDeCode -#100DaysOfCode -#100daysofcode',
      result_type: 'recent'
    },
    (err, data) => {
      if (!err) {
        const recentTweets = data.statuses
        recentTweets.forEach(tweet => {
          if (isReply(tweet)) {
            console.log(`c'est une réponse, on ne retweete pas.`)
            return
          }else {
            bot.post(
              'statuses/retweet/:id',
              {
                id: tweet.id_str
              },
              (err, response) => {
                if (response) {
                  console.log('Retweet réussi :)')
                }
                if (err) {
                  console.log('Le retweet a échoué! :(')
                }
              }
            )
          }
        })
      }
      else {
        console.log('La recherche a échoué! :(')
      }
    }
  )  
}

retweetRecent()

setInterval(retweetRecent, 3000000)