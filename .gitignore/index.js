const { Client, RichEmbed } = require('discord.js');
const bot = new Client({ disableEveryone: true })

let prefix = '!'

bot.login(process.env.TOKEN);

bot.on('message', function (message) {
    if (message.content.startsWith(prefix + 'help')) {
        message.channel.send('Les commandes disponibles sont : !numberplayer, !site, !regle, !cgv, !shop, !b')
    }
})

const tell = '!tell'

bot.on('message', message => {
  if (message.content.startsWith(tell)) {
    const str = message.content.substring(tell.length)
    message.channel.bulkDelete(parseInt(1))
    message.channel.send(`**${str}**`)
  }
});

bot.on('message', function (message) {
    if (message.content.startsWith('!avatar')) {

        const membre = message.mentions.users.first() || message.author;

        var embed = new RichEmbed()
        .setTitle(`Avatare de **${membre.username}**`)
        .setDescription(`[Télécharger](${membre.displayAvatarURL})`)
        .setImage(membre.displayAvatarURL)
    
        message.channel.send(embed)
    }
})

bot.on('message', function (message) {
    if (message.content === '!bvn') {
	message.channel.bulkDelete(parseInt(1))
	message.reply('vous souhaite la bienvenue !')
    }
 }) 

bot.on('message', function (message) {
    if (message.content === '!info') {
    var embed = new RichEmbed()
    .setTitle(`**Les info de WhereCraft**`)
    .setDescription(`WhereCraft est un ensemble de 2 serveurs minecraft moddé (Un Survie / Un RP)\nLe serveur fonctionne sous launcher obligatoirement !`)
    .addField(`**Les liens importants :**`, `[Le Site](https://www.wherecraft.eu/)\n[Le Réglement](https://www.wherecraft.eu/p/reglement)\n[La Boutique](https://www.wherecraft.eu/shop)\n[Voter pour le serveur](https://wherecraft.eu/vote)\n[Les conditions général de vente](https://www.wherecraft.eu/p/cgu-cgv)`)
    .setColor(0x3edc83)

    message.channel.send(embed)
    }
})

bot.on('message', function (message) {
    if (message.content === '!site') {
        message.channel.send('https://www.wherecraft.eu/')
    }
})

bot.on('message', function (message) {
    if (message.content === '!regle') {
        message.channel.send('https://www.wherecraft.eu/p/reglement')
    }
})

bot.on('message', function (message) {
    if (message.content === '!cgv') {
        message.channel.send('https://www.wherecraft.eu/p/cgu-cgv')
    }
})

bot.on('message', function (message) {
    if (message.content === '!shop') {
        message.channel.send('https://www.wherecraft.eu/shop')
    }
})

bot.on('message', function (message) {
    if (message.content === '!ping') {

        let début = Date.now();
        message.channel.send("Ping ?").then(async(m) => await m.edit(` Votre ping est ${Date.now() - début} ms`));
    }
})

bot.on('message', function (message) {

    function sendError(message, description) {
        message.channel.send({embed: {
            color: 0xe43333,
            description: ':x: ' + description
        }});
    }

    if (message.content === '!ticket') {

        const categoryId = "588677993308618761"

    var username = message.author.username;
    var userDiscriminator = message.author.discriminator;

    var bool = false;

    message.guild.channels.forEach((channel) => {

        if (channel.name == username.toLowerCase() + "-" + userDiscriminator) {

            sendError(message, `Vous avez déjà un ticket d'ouvert`);

            bool = true;

        }

    });

    if (bool == true) return;

    var embed = new RichEmbed()
        .setTitle(`Hey, ${message.author.username} !`)
        .setDescription(`**Merci de donner quel est votre demande de support**\n\n\:o: **: Bug**\n:pick: **: Problème**\n:construction_worker: **: Demande autre**\n:heavy_multiplication_x: **: Annulé**`)
        .setColor(0x42ff00)

    message.channel.send(embed).then(msg => {
        msg.react('⭕')
        msg.react('⛏')
        msg.react('👷')
        msg.react('✖')

    
            const bugFilter = (reaction, user) => reaction.emoji.name === '⭕' && user.id === message.author.id;

            const problèmeFilter = (reaction, user) => reaction.emoji.name === '⛏' && user.id === message.author.id;

            const demandeFilter = (reaction, user) => reaction.emoji.name === '👷' && user.id === message.author.id;

            const annuléFilter = (reaction, user) => reaction.emoji.name === '✖' && user.id === message.author.id;
    
            const bug = msg.createReactionCollector(bugFilter, { time : 60000 })

            const problème = msg.createReactionCollector(problèmeFilter, { time : 60000 })

            const demande = msg.createReactionCollector(demandeFilter, { time : 60000 })

            const annulé = msg.createReactionCollector(annuléFilter, { time : 60000 })

            annulé.on('collect', r => {

                msg.delete()

                var embedAnnulé = new RichEmbed()
                .setTitle(`Vous avez annulé la\ndemande de support`)
                .setThumbnail(message.author.displayAvatarURL)
                .setColor(0xe43333)

                message.channel.send(embedAnnulé)

            })
    
            bug.on('collect', r => {

                    msg.delete()

                    var embedTicketBug = new RichEmbed()
                    .setTitle(`Channel support\nticket créer !`)
                    .setThumbnail(message.author.displayAvatarURL)
                    .setDescription(`Channel support\nticket créer !`)
                    .setColor(0xffff00)

                    message.channel.send(embedTicketBug)

                    message.guild.createChannel(username + "-" + userDiscriminator, "text").then((createdChannel) => {

                    createdChannel.setParent(categoryId).then((settedParent) => {

                            settedParent.overwritePermissions(message.guild.roles.find("id", "506845498079182848"), {"READ_MESSAGES": false,});

                            settedParent.overwritePermissions(message.guild.roles.find("id", "494928320820150282"), {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});

                            settedParent.overwritePermissions(message.author, {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});

                    var embedParent = new RichEmbed()
                        .setTitle(`Hey, ` + message.author.username.toString())
                        .setThumbnail(message.author.displayAvatarURL)
                        .setDescription(`\nVoilà le channel\nVous avez demandez un \nsupport pour un **BUG**`)
                        .setColor(0x42ff00)
        
                    settedParent.send(embedParent);
                
                }).catch(err => {
                    sendError("Erreur dans la configuration")
                });
    
            }).catch(err => {
                sendError("Erreur dans la configuration")
            });

        })

        problème.on('collect', r => {

            msg.delete()

            var embedTicketProblème = new RichEmbed()
            .setTitle(`Channel support\nticket créer !`)
            .setThumbnail(message.author.displayAvatarURL)
            .setDescription(`Channel support\nticket créer !`)
            .setColor(0xffff00)

            message.channel.send(embedTicketProblème)

            message.guild.createChannel(username + "-" + userDiscriminator, "text").then((createdChannel) => {

            createdChannel.setParent(categoryId).then((settedParent) => {

                    settedParent.overwritePermissions(message.guild.roles.find("id", "506845498079182848"), {"READ_MESSAGES": false,});

                    settedParent.overwritePermissions(message.guild.roles.find("id", "494928320820150282"), {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});

                    settedParent.overwritePermissions(message.author, {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});

            var embedParent = new RichEmbed()
                .setTitle(`Hey, ` + message.author.username.toString())
                .setThumbnail(message.author.displayAvatarURL)
                .setDescription(`\nVoilà le channel\nVous avez demandez un \nsupport pour un **PROBLÈME**`)
                .setColor(0x42ff00)

            settedParent.send(embedParent);
    
            }).catch(err => {
            sendError("Erreur dans la configuration")
            });

        }).catch(err => {
        sendError("Erreur dans la configuration")
        });

        })

        demande.on('collect', r => {

            msg.delete()

            var embedTicketDemande = new RichEmbed()
            .setTitle(`Channel support\nticket créer !`)
            .setThumbnail(message.author.displayAvatarURL)
            .setDescription(`Channel support\nticket créer !`)
            .setColor(0xffff00)

            message.channel.send(embedTicketDemande)

            message.guild.createChannel(username + "-" + userDiscriminator, "text").then((createdChannel) => {

            createdChannel.setParent(categoryId).then((settedParent) => {

                    settedParent.overwritePermissions(message.guild.roles.find("id", "506845498079182848"), {"READ_MESSAGES": false,});

                    settedParent.overwritePermissions(message.guild.roles.find("id", "494928320820150282"), {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});

                    settedParent.overwritePermissions(message.author, {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});

            var embedParent = new RichEmbed()
                .setTitle(`Hey, ` + message.author.username.toString())
                .setThumbnail(message.author.displayAvatarURL)
                .setDescription(`\nVoilà le channel\nVous avez demandez un \nsupport pour une **DEMANDE**`)
                .setColor(0x42ff00)

            settedParent.send(embedParent);
    
            }).catch(err => {
            sendError("Erreur dans la configuration")
            });

        }).catch(err => {
        sendError("Erreur dans la configuration")
        });

        })

})

        

    }

    if (message.content === '!close') {

        const categoryId = "588677993308618761"
    
        if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return sendError(message, `Vous n'avez pas la permission`);
    
            if(message.channel.parentID == categoryId){
                message.channel.delete();
    
            }else{
    
                sendError(message, `Commande disponible que dans un ticket`)
    
            }
    }
})



bot.on('message', function (message) {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    if (message.content.startsWith(prefix + 'sondage')) {
        const { Attachment } = require('discord.js');
    const attachment = new Attachment('https://cdn.discordapp.com/attachments/530118434743386163/573797119165464577/gif_agoz.gif');
    
    function sendError(message, description) {
        message.channel.send({embed: {
            color: 0xe43333,
            description: ':x: ' + description
        }});
    }

    let question = args.join(" ").slice(1);
    if(question) {

    var embed = new RichEmbed()
    .setDescription("***Sondage***")
    .addField(`**${question}**`, "\n\n*Réagissez avec ✅ ou ❌*")
    .setColor("0x0fff00")
    .setFooter(`Sondage de ${message.author.username}`)

    let sondagechannel = message.guild.channels.find(`id`, "573551907222716467");
    if(!sondagechannel) return sendError(message, "Je n'ai pas trouvé le channel des sondages !");

    sondagechannel.send(attachment)
    .then(function(message) {
        sondagechannel.send(embed)
        .then(function(message) {
            message.react("✅")
            message.react("❌")
        })
        sondagechannel.send(attachment)

    })

} else {
    sendError(message, `Veuillez inscrire un sondage`)
}

    message.delete().catch(O_o=>{});
    }

})


bot.on('message', function (message) {
    if (message.content === '!serverinfo') {
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
        
        const embed = new RichEmbed()
            .setTitle(`Information sur le serveur`)
            .addField(":scroll: Nom :", message.guild.name, true)
            .addField(":computer: ID :", message.guild.id, true)
            .addField(":construction_worker: Propiétaire :", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
            .addField(":flag_white: Region :", region[message.guild.region], true)
            .addField(":pushpin: Nombre d'utilisateur :", `Il y a **${message.guild.memberCount}** utilisateur`, true)
            .addField(":joystick: Nombre de joueur :", `Il y a **${message.guild.members.filter(member => !member.user.bot).size}** joueurs`, true)
            .addField(":robot: Nombre de bot :", `Il y a **${message.guild.members.filter(member => member.user.bot).size}** bots`, true)
            .addField(":closed_lock_with_key: Niveau de vérification :", `Le niveau est **${verifLevels[message.guild.verificationLevel]}**`, true)
            .addField(":pencil: Nombre de Channels :", `Il y a **${message.guild.channels.size}** Channels`, true)
            .addField(":orange_book: Nombre de Rôles", `Il y a **${message.guild.roles.size}** Rôles`, true)
            .addField(":date: Date de création :", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
            .setThumbnail(message.guild.iconURL)
        message.channel.send({embed});
    }
})

bot.on('ready', function () {
    bot.user.setActivity('Dev-Mode : Balafre78').catch(console.error)
})

bot.on('guildMemberAdd', function (member) {
    member.createDM().then(function (channel) {
        return channel.send('Bienvenue sur **Wherecraft**  ' + member.displayName )
 
    }).catch(console.error)
})
