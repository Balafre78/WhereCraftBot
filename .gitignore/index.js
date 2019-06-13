const Discord = require('discord.js');
const ascii = require('ascii-art')

const client = new Discord.Client();

client.login(process.env.TOKEN)

var prefix = '!'

client.on('ready', () => {

    console.log(`Le Bot est en ligne | Nom : ${client.user.tag} | Id : ${client.user.id}`)
    client.user.setActivity(`!help | Buickawz`)
})

client.on('message', message => {

  if (message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd === 'ping') {
    let début = Date.now();
    message.channel.send("Ping ?").then(async(m) => await m.edit(` Votre ping est ${Date.now() - début} ms`));
  }

  if (cmd === 'avatar') {
    const membre = message.mentions.users.first() || message.author;

      var embed = new Discord.RichEmbed()
      .setTitle(`Avatare de **${membre.username}**`)
      .setDescription(`[Télécharger](${membre.displayAvatarURL})`)
      .setImage(membre.displayAvatarURL)
  
      message.channel.send(embed)
      message.delete().catch(O_o=>{});
  }

  if (cmd === 'info') {
    const membre = message.author;

    var info = new Discord.RichEmbed()
        .setTitle(":comet: Information sur **Buickawz** :comet:")
        .setDescription("Serveur Minecraft Pvp-Faction / Mini-Jeux 1.12.2")
        .addField("Le site : ","[Buickawz](https://buickawz.000webhostapp.com/)")
        .addField("!help","Voir la liste des commandes")
        .addField("La Boutique","[Boutique](http://buickawz.buycraft.net/)")
        .setColor("0xAAFFFF")
        .setFooter(`Demandé par ${membre.username}`, membre.displayAvatarURL)
    message.channel.send(info);

  }

  

})

client.on('message', message => {

  if(message.content.startsWith(prefix + 'serverinfo')) {

      function checkDays(date) {
          let now = new Date();
          let diff = now.getTime() - date.getTime();
          let days = Math.floor(diff / 86400000);
          return days + (days == 1 ? " day" : " days") + " ago";
      };
      let verifLevels = ["Inéxistant", "Faible", "Moyen", "Fort", "Hard"];
      let region = {
          "brazil": ":flag_br: Brésil",
          "eu-central": ":flag_eu: Europe Centrale",
          "singapore": ":flag_sg: Singapour",
          "us-central": ":flag_us: U.S. Centrale",
          "sydney": ":flag_au: Sydney",
          "us-east": ":flag_us: U.S. Est",
          "us-south": ":flag_us: U.S. Sud",
          "us-west": ":flag_us: U.S. Ouest",
          "eu-west": ":flag_eu: Western Europe",
          "vip-us-east": ":flag_us: VIP U.S. East",
          "london": ":flag_gb: Londre",
          "amsterdam": ":flag_nl: Amsterdam",
          "hongkong": ":flag_hk: Hong Kong",
          "russia": ":flag_ru: Russie",
          "southafrica": ":flag_za:  Afrique du sud"
      };
      
      const embed = new Discord.RichEmbed()
          .setTitle(`Information sur le serveur`)
          .addField(":scroll: Nom :", message.guild.name, true)
          .addField(":computer: ID :", message.guild.id, true)
          .addField(":construction_worker: Propiétaire :", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
          .addField(":flag_white: Region :", region[message.guild.region], true)
          .addField(":pushpin: Nombre d'utilisateur :", `Il y a **${message.guild.memberCount}** utilisateur`, true)
          .addField(":joystick: Nombre de joueur :", `Il y a **${message.guild.members.filter(member => !member.user.bot).size}** bots`, true)
          .addField(":robot: Nombre de bot :", `Il y a **${message.guild.members.filter(member => member.user.bot).size}** joueurs`, true)
          .addField(":closed_lock_with_key: Niveau de vérification :", `Le niveau est **${verifLevels[message.guild.verificationLevel]}**`, true)
          .addField(":pencil: Nombre de Channels :", `Il y a **${message.guild.channels.size}** Channels`, true)
          .addField(":orange_book: Nombre de Rôles", `Il y a **${message.guild.roles.size}** Rôles`, true)
          .addField(":date: Date de création :", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
          .setThumbnail(message.guild.iconURL)
      message.channel.send({embed});

  }

  if(message.content.startsWith(prefix + 'help')) {

  var embed5 = new Discord.RichEmbed()
  .setTitle(`Menu des commandes`)
  .setDescription(`Préfix : **!** + [commande]`)
  .setColor("0xd800ff")

  var embed = new Discord.RichEmbed()
  .setTitle(`${message.author.username}, Veuillez consulter vos messages privées`)
  .setColor("0xd800ff")

  message.author.send({
      "embed": {
        "color": 16765104,
        "footer": {
          "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
          "text": "Commandes Joueurs"
        },
        "fields": [
          {
            "name": ":pick: `info`",
            "value": "*Information sur le serveur*",
            "inline": true
          },
          {
            "name": ":eye: `stats <pseudo>`",
            "value": "*Statistiques d'un joueur*",
            "inline": true
          },
          {
            "name": ":sparkles: `ping`",
            "value": "*Votre ping*",
            "inline": true
          },
          {
            "name": ":link: `invite`",
            "value": "*Invitation au channel*",
            "inline": true
          },
          {
            "name": ":pencil: `reports <pseudo> [Raison]`",
            "value": "*Report un joueur*",
            "inline": true
          },
          {
            "name": ":tickets: `ticket`",
            "value": "*Ouvrir un channel de support*",
            "inline": true
          },
          {
            "name": "<:discord:576776716870221824> `avatar <pseudo>`",
            "value": "*Avatar d'un joueur*",
            "inline": true
          },
          {
            "name": ":scroll: `messages`",
            "value": "*Messages envoyés*",
            "inline": true
          }
        ]
      }
    })

  message.author.send({
      "embed": {
        "color": 12779770,
        "footer": {
          "icon_url": "https://www.pngkey.com/png/full/356-3562324_app-logo-youtube-music-icon.png",
          "text": "Commandes Musiques"
        },
        "fields": [
          {
            "name": ":arrow_forward: `play <URL|MUSIQUE|VIDEO>`",
            "value": "*Jouer de la musique*",
            "inline": true
          },
          {
            "name": ":fast_forward: `skip`",
            "value": "*Passer à la musique suivante*",
            "inline": true
          },
          {
            "name": ":pause_button: `pause`",
            "value": "*Pause de la musique*",
            "inline": true
          },
          {
            "name": ":play_pause: `resume`",
            "value": "*Reprendre la musique*",
            "inline": true
          },
          {
            "name": ":record_button: `music`",
            "value": "*Lecture en cours*",
            "inline": true
          },
          {
            "name": ":signal_strength: `volume <nombre>`",
            "value": "*Volume de la musique*",
            "inline": true
          },
          {
            "name": " :stop_button: `stop`",
            "value": "*Arêter la musique*",
            "inline": true
          },
          {
            "name": ":symbols: `list`",
            "value": "*Voir la liste des musiques*",
            "inline": true
          }
        ]
      }
    })
  
  message.author.send({
      "embed": {
        "color": 1608194,
        "footer": {
          "icon_url": "https://nowskills.co.uk/wp/wp-content/uploads/2018/07/money-PNG-e1532606569895.png",
          "text": "Commandes Money"
        },
        "fields": [
          {
            "name": "<:coin:574530477235634186> `money <pseudo>`",
            "value": "*Connaitre la money d'un joueur*",
            "inline": true
          },
          {
            "name": ":money_with_wings: `pay <pseudo> [somme]`",
            "value": "*Donner de l'argent à un joueur*",
            "inline": true
          },
          {
            "name": ":clock2: `daily`",
            "value": "*Recevoir sa prime du jour*    ",
            "inline": true
          },
          {
            "name": ":trophy: `baltop`",
            "value": "*Meilleur joueur du serveur*",
            "inline": true
          }
        ]
      }
    })

  message.author.send({
    "embed": {
      "color": 16711711,
      "footer": {
        "icon_url": "https://vignette.wikia.nocookie.net/scribblenauts/images/0/06/Gear.png/revision/latest?cb=20130511220556",
        "text": "Commandes Staff"
      },
      "fields": [
        {
          "name": ":nut_and_bolt: `kick <pseudo>`",
          "value": "*Expulser un membre du serveur*",
          "inline": true
        },
        {
          "name": ":hammer: `ban <pseudo>`",
          "value": "*Bannir un membre du serveur*",
          "inline": true
        },
        {
          "name": ":mute: `mute <pseudo> [Temps]`",
          "value": "*Mute un membre du serveur*",
          "inline": true
        },
        {
          "name": ":speaker: `unmute <pseudo>`",
          "value": "*Unmute un membre du serveur*",
          "inline": true
        },
        {
          "name": ":wastebasket: `clear <nombre entre 1 et 100>`",
          "value": "*Clear entre 1 et 100 messages*",
          "inline": true
        },
        {
          "name": ":e_mail: `mail <pseudo> [Message]`",
          "value": "*Envoyé un message privé a un joueur*",
          "inline": true
        },
        {
          "name": ":thinking: `Sondage [messages]`",
          "value": "*Sondage sur [message] ?*",
          "inline": true
        },
        {
          "name": ":euro: `moneygive <pseudo> [somme]`",
          "value": "*Give de la money a un joueur*",
          "inline": true
        },
                    {
          "name": ":exclamation: `warn <pseudo>`",
          "value": "*Alerte sur comportement d'un membre du staff*",
          "inline": true
        },
                    {
          "name": ":repeat: `reload [Commande]`",
          "value": "*Reload une commande*",
          "inline": true
        }
      ]
    }
  }

  )

  message.channel.send(embed)

  }
})