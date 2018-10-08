const Twit = require('twit')
const config = require('./config')

const bot = new Twit(config)

const isReply = require('./helpers/isReply')

// un premier test de l'API : récupérer et afficher dans la console les noms des followers
bot.get(
  'followers/list',
  {
    screen_name: '100joursdecode',
    count: 200
  },
  (err, data, response) => {
    // haha je ne sais pas ce que fait cette "response" ici, peut-être un vieux bout de brouillon qui a mal tourné, 
    // TODO rechercher pour savoir si on peut le virer. A prioiri oui.
    if (err) {
      console.log(err)
    } else {
      data.users.forEach(user => {
        console.log(user.screen_name)
      })
    }
  }
)
// Retweeter les messages contenant #100JoursDeCode
const retweetRecent = () => {
  // on lit les tweets récents. 
  // Ils ne doivent pas contenir les hashtags anglais, seulement le hashtag français. 
  // (pour ne pas flooder en anglais la communauté francophone.)
  bot.get(
    'search/tweets',
    {
      q: '#100JoursDeCode -#100DaysOfCode -#100daysofcode',
      result_type: 'recent'
    },
    (err, data) => {
      if (!err) {
        const recentTweets = data.statuses
        //on loop sur les récents tweets ainsi obtenus:
        recentTweets.forEach(tweet => {
          //On ne retweete pas une reply (un retweet ou une réponse à un message contenant #100JoursDeCode)
          if (isReply(tweet)) {
            console.log(`c'est une réponse, on ne retweete pas.`)
            return
          }else {
            // Autrement, on utilise POST (= pour écrire) pour faire un retweet du message.
            bot.post(
              'statuses/retweet/:id',
              {
                id: tweet.id_str
              },
              (err, response) => {
                // j'édite deux messages pour voir ce qu'il se passe dans la console.
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

//on appelle cette fonction
retweetRecent()
// on la répète toutes les 3000000 millisecondes = 50 minutes
setInterval(retweetRecent, 3000000)