const Discord = require('discord.js');
const { Client, Util} = require('discord.js');
let PREFIX = '!'
let GOOGLE_API_KEY = 'AIzaSyBJNCSHBKmN5EHf2QoHETtbZVtrZTZcEds'
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();
const client = new Discord.Client({ disableEveryone: true });

// Token \\

client.login(process.env.TOKEN);

// Client Discord \\

client.on('error', console.error)

client.on("ready", async () => {

    console.log(`En ligne | Nom : ${client.user.username} | Tag : #${client.user.discriminator} | Id : ${client.user.id}`)
})


// Musique \\

    client.on('message', async msg => { // eslint-disable-line
        if (msg.author.bot) return undefined;
        if (!msg.content.startsWith(PREFIX)) return undefined;
   
        const args = msg.content.split(' ');
        const searchString = args.slice(1).join(' ');
        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        const serverQueue = queue.get(msg.guild.id);
 
        function sendError(msg, description) {
            msg.channel.send({embed: {
                color: 0xe43333,
                description: ':x: ' + description
            }});
        }
        function send(msg, description) {
            msg.channel.send({embed: {
                color: 0xAAFFFF,
                description: ':musical_note: ' + description
            }});
        }
   
        let command = msg.content.toLowerCase().split(' ')[0];
        command = command.slice(PREFIX.length)
   
        if (command === 'play') {
            const voiceChannel = msg.member.voiceChannel;
            if (!voiceChannel) return sendError(msg, 'Je suis désolé mais vous avez besoin d’un canal vocal pour jouer de la musique !');
            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT')) {
                return sendError(msg, 'Je ne parviens pas à me connecter à votre canal vocal, assurez-vous de disposer des autorisations appropriées !');
            }
            if (!permissions.has('SPEAK')) {
                return sendError(msg, 'Je ne peux pas parler sur ce canal vocal, assurez-vous de disposer des autorisations appropriées !');
            }
   
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                const playlist = await youtube.getPlaylist(url);
                const videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                    await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
                }
                return send(msg, `Playlist: **${playlist.title}** a été ajouté à la file d'attente !`);
           } else {
               try {
                   var video = await youtube.getVideo(url);
               } catch (error) {
                   try {
                       var videos = await youtube.searchVideos(searchString, 10);
                       let index = 0;
                       send(msg, `**Sélection de la Musique:**
   
   ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
   
Veuillez fournir une valeur pour sélectionner l'un des résultats de la recherche, allant de 1 à 10.
                        `);
                        // eslint-disable-next-line max-depth
                        try {
                            var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                                maxMatches: 1,
                                time: 30000,
                                errors: ['time']
                            });
                        } catch (err) {
                            console.error(err);
                            return sendError(msg, 'Aucune valeur ou valeur invalide entrée, annulant la sélection de vidéo.');
                        }
                        const videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        console.error(err);
                        return sendError(msg, "Je n'ai pu obtenir aucun résultat de recherche.");
                    }
                }
                return handleVideo(video, msg, voiceChannel);
            }
        } else if (command === 'skip') {
            if (!msg.member.voiceChannel) return sendError(msg, "Vous n'êtes pas dans un canal vocal !");
            if (!serverQueue) return sendError(msg, "Il n'y a rien que je puisse Skip pour vous.");
            serverQueue.connection.dispatcher.end('La commande Skip a été utilisée !');
            return undefined;
        } else if (command === 'stop') {
            if (!msg.member.voiceChannel) return sendError(msg, "Vous n'êtes pas dans un canal vocal !");
            if (!serverQueue) return sendError(msg, "Il n'y a rien que je puisse arrêter de jouer");
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end("La commande Stop a été utilisée !");
            send(msg, `Stop de la musique !`)
            return undefined;
        } else if (command === 'volume') {
            if (!msg.member.voiceChannel) return sendError(msg, "Vous n'êtes pas dans un canal vocal !");
            if (!serverQueue) return sendError(msg, "Il n'y a rien qui joue.");
            if (!args[1]) return send(msg, `Le volume actuel est: **${serverQueue.volume}**`);
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            return send(msg, `Je règle le volume à: **${args[1]}**`);
        } else if (command === 'music') {
            if (!serverQueue) return msg.channel.sendError("Il n'y a rien qui joue.");
            return send(msg, `Lecture en cours: **${serverQueue.songs[0].title}**`);
        } else if (command === 'list') {
            if (!serverQueue) return sendError(msg, "Il n'y a rien qui joue.");
            return send(msg, `**File d'attente de la Musique :**
    
${serverQueue.songs.map(song => `**●** ${song.title}`).join('\n')}
    
**Lecture en cours :** ${serverQueue.songs[0].title}
           `);
       } else if (command === 'pause') {
           if (serverQueue && serverQueue.playing) {
               serverQueue.playing = false;
               serverQueue.connection.dispatcher.pause();
               return send(msg, `Pause de la musique !`);
           }
           return sendError(msg, `Il n'y a rien qui joue.`);
       } else if (command === 'resume') {
           if (serverQueue && !serverQueue.playing) {
               serverQueue.playing = true;
               serverQueue.connection.dispatcher.resume();
               return send(msg, `Reprise de la musique`);
           }
           return sendError(msg, `Il n'y a rien qui joue.`);
       }
   
       return undefined;
   });
   
   async function handleVideo(video, msg, voiceChannel, playlist = false) {
       const serverQueue = queue.get(msg.guild.id);
       console.log(video);
       const song = {
           id: video.id,
           title: Util.escapeMarkdown(video.title),
           url: `https://www.youtube.com/watch?v=${video.id}`
       };
       if (!serverQueue) {
           const queueConstruct = {
               textChannel: msg.channel,
               voiceChannel: voiceChannel,
               connection: null,
               songs: [],
               volume: 5,
               playing: true
           };
           queue.set(msg.guild.id, queueConstruct);
   
           queueConstruct.songs.push(song);
   
           try {
               var connection = await voiceChannel.join();
               queueConstruct.connection = connection;
               play(msg.guild, queueConstruct.songs[0]);
           } catch (error) {
               console.error(`Je ne pouvais pas rejoindre le canal vocal: ${error}`);
               queue.delete(msg.guild.id);

               function sendError(msg, description) {
                msg.channel.send({embed: {
                    color: 0xe43333,
                    description: ':x: ' + description
                }});
                }
               return sendError(msg, `Je ne pouvais pas rejoindre le canal vocal: ${error}`);
           }
       } else {
            var SongList = new Discord.RichEmbed()
            .setDescription(`:musical_note: **${song.title}** a été ajouté à la file d'attente !`)
            .setColor(0xAAFFFF)

           serverQueue.songs.push(song);
           console.log(serverQueue.songs);
           if (playlist) return undefined;
           else return serverQueue.textChannel.send(SongList);
        }
        return undefined;
    }
   
    function play(guild, song) {
        const serverQueue = queue.get(guild.id);
   
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        console.log(serverQueue.songs);
   
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough.') console.log("La Musique s'est terminée.");
                else console.log(reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        var SongTitle = new Discord.RichEmbed()
        .setDescription(`:musical_note: Commence à jouer: **${song.title}**\n\n<:youtube:589146429302374410> URL : **${song.url}**`)
        .setColor(0xAAFFFF)
   
        serverQueue.textChannel.send(SongTitle);
    }

    client.on('message', message => {

        function sendError(message, description) {
            message.channel.send({embed: {
                color: 0xe43333,
                description: ':x: ' + description
            }});
        }
    
        if (message.author.bot || !message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
    
        if (cmd === 'ping') {
            let début = Date.now();
            message.channel.send("**Ping ?**").then(async(m) => await m.edit(` Votre ping est **${Date.now() - début}** ms`));
        }
    
        if (cmd === 'avatar') {
    
            const membre = message.mentions.users.first() || message.author;
    
            var avatar = new Discord.RichEmbed()
            .setTitle(`Avatare de **${membre.username}**`)
            .setDescription(`[Télécharger](${membre.displayAvatarURL})`)
            .setImage(membre.displayAvatarURL)
      
            message.channel.send(avatar)
            message.delete().catch(O_o=>{});
        }
    
        if (cmd === 'info') {
    
        var info = new Discord.RichEmbed()
        .setTitle(`**Les infos de Wherecraft**`)
        .setDescription(`Wherecraft est un ensemble de 2 serveurs minecraft moddé (Un Survie / Un RP)\nLe serveur fonctionne sous launcher obligatoirement !`)
        .addField(`**Les liens importants :**`, `[Le Site](https://www.wherecraft.eu/)\n[Le Réglement](https://www.wherecraft.eu/p/reglement)\n[La Boutique](https://www.wherecraft.eu/shop)\n[Voter pour le serveur](https://wherecraft.eu/vote)\n[Les conditions général de vente](https://www.wherecraft.eu/p/cgu-cgv)`)
        .setColor(0x3edc83)
    
        message.channel.send(info)
    
      }
    
        if (cmd === 'alert') {
    
            let text = args.join(" ").slice(0);
    
            if(!text) return sendError(message, `Merci de renseigner le sujet de l'alert\n\n!alert <message>`)
    
            var tell = new Discord.RichEmbed()
            .setTitle(`⚠️ **${text}** ⚠️`)
            .setColor(0xfbff00)
    
            message.channel.send(tell)
            
            message.delete().catch(O_o=>{});
    
        }
    
        if (cmd === 'sondage') {
    
            const { Attachment } = require('discord.js');
            const attachment = new Attachment('https://cdn.discordapp.com/attachments/530118434743386163/573797119165464577/gif_agoz.gif');
        
            function sendError(message, description) {
                message.channel.send({embed: {
                    color: 0xe43333,
                    description: ':x: ' + description
                }});
            }
    
            let question = args.join(" ").slice(22);
            if(question) {
    
            var embed = new Discord.RichEmbed()
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
    
        if (cmd === 'serverinfo') {
    
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
            
            var embed = new Discord.RichEmbed()
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
                
            message.channel.send(embed);
        }
    
    
    })
    
    client.on('message', function (message) {
    
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
    
        var embed = new Discord.RichEmbed()
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
    
                    var embedAnnulé = new Discord.RichEmbed()
                    .setTitle(`Vous avez annulé la\ndemande de support`)
                    .setThumbnail(message.author.displayAvatarURL)
                    .setColor(0xe43333)
    
                    message.channel.send(embedAnnulé)
    
                })
        
                bug.on('collect', r => {
    
                        msg.delete()
    
                        var embedTicketBug = new Discord.RichEmbed()
                        .setTitle(`Channel support\nticket créer !`)
                        .setThumbnail(message.author.displayAvatarURL)
                        .setDescription(`Channel support\nticket créer !`)
                        .setColor(0xffff00)
    
                        message.channel.send(embedTicketBug)
    
                        message.guild.createChannel(username + "-" + userDiscriminator, "text").then((createdChannel) => {
    
                        createdChannel.setParent(categoryId).then((settedParent) => {
    
                                settedParent.overwritePermissions(message.guild.roles.find("id", "146281705949364224"), {"READ_MESSAGES": false,});
    
                                settedParent.overwritePermissions(message.guild.roles.find("id", "555111820407341057"), {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});
    
                                settedParent.overwritePermissions(message.author, {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});
    
                        var embedParent = new Discord.RichEmbed()
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
    
                var embedTicketProblème = new Discord.RichEmbed()
                .setTitle(`Channel support\nticket créer !`)
                .setThumbnail(message.author.displayAvatarURL)
                .setDescription(`Channel support\nticket créer !`)
                .setColor(0xffff00)
    
                message.channel.send(embedTicketProblème)
    
                message.guild.createChannel(username + "-" + userDiscriminator, "text").then((createdChannel) => {
    
                createdChannel.setParent(categoryId).then((settedParent) => {
    
                        settedParent.overwritePermissions(message.guild.roles.find("name", "146281705949364224"), {"READ_MESSAGES": false,});
    
                        settedParent.overwritePermissions(message.guild.roles.find("id", "555111820407341057"), {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});
    
                        settedParent.overwritePermissions(message.author, {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});
    
                var embedParent = new Discord.RichEmbed()
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
    
                var embedTicketDemande = new Discord.RichEmbed()
                .setTitle(`Channel support\nticket créer !`)
                .setThumbnail(message.author.displayAvatarURL)
                .setDescription(`Channel support\nticket créer !`)
                .setColor(0xffff00)
    
                message.channel.send(embedTicketDemande)
    
                message.guild.createChannel(username + "-" + userDiscriminator, "text").then((createdChannel) => {
    
                createdChannel.setParent(categoryId).then((settedParent) => {
    
                        settedParent.overwritePermissions(message.guild.roles.find("id", "146281705949364224"), {"READ_MESSAGES": false,});
    
                        settedParent.overwritePermissions(message.guild.roles.find("id", "555111820407341057"), {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});
    
                        settedParent.overwritePermissions(message.author, {"READ_MESSAGES": true, "SEND_MESSAGES": true,"ATTACH_FILES": true, "CONNECT": true,"CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true, "VIEW_CHANNEL": true,});
    
                var embedParent = new Discord.RichEmbed()
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
