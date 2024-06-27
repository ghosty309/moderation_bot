const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType  } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Setup AutoMod system')
    .addSubcommand(command => 
        command.setName('anti-links')
        .setDescription('block links on this server')
        .addChannelOption(option => option.setName('alert-channel')
            .setDescription('channel where alerts are sent')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('channel allowed to send links')
            .addChannelTypes(ChannelType.GuildText)))
    .addSubcommand(command => 
        command
        .setName('mention-spam')
        .setDescription('Bloquea el spam de menciones')
        .addChannelOption(option =>
            option.setName('mentions-alert')
            .setDescription('channel where alerts are sent')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
            .addIntegerOption(option => 
                option.setName('timeout')
                .setDescription('timeout member, default is 1 minute, maximum 40320 minutes (4 weeks)')))
    .addSubcommand(command => 
        command
        .setName('spam-messages')
        .setDescription('block messages suspected of spam'))
    .addSubcommand(command => 
        command
        .setName('keyword')
        .setDescription('block a given keyword in the server')
        .addStringOption(option => 
            option.setName('word')
            .setDescription('The word to block')
            .setRequired(true)))
    .addSubcommand(command => 
        command.setName('anti-invites')
        .setDescription('block invites of discords'))
        .addSubcommand(command => 
            command
            .setName('flagged-words')
            .setDescription('block profanety, sexual content, and slurs')),

    async execute(interaction, client) {

        const {guild, options} = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
        return await interaction.reply({content: `You dont have perms to setUp AutoMod within this server`, ephemeral: true})

        try {
            switch (sub) {
                case 'flagged-words':
                    try {
                        await interaction.reply({content: `Loadding your automod rule...`})
                        const rule = await guild.autoModerationRules.create({
                        name: `Block profanity, sexual content and slurs by: ${client.user.tag}`,
                        creatorId: `245339452464037888`,
                        enabled: true,
                        eventType: 1,
                        triggerType: 4,
                        triggerMetadata:
                            {
                                baseType: 4,
                                presets: [1, 2 , 3],
                                allowList: [],
                                regexPatterns: []
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `This message was prevented by ${client.user.tag} Auto Moderation.`
                                    }
                                }
                            ]
                    }).catch(async err => {
                        setTimeout(async () => {
                            console.log(err);
                            await interaction.editReply({ content: `${err}`});
                        }, 2000)
                    })
                    setTimeout(async () => {
                        if (!rule) return; 
                        const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`You AutoMod rule has been created- all swears will be stopped by ${client.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL()})
                        await interaction.editReply({content: ``, embeds: [embed]});
                    }, 3000)
                    } catch (error) {
                        console.log(error);
                        await interaction.folloUp({ content: `An error occurred while processing your request. Please try again in 5 seconds.` })
                        setTimeout(async () => {
                            await interaction.deteteReply().catch(() => {});
                        }, 5000);
                    }
                    break;
    
                    case 'keyword':
                        
                    try {
                        await interaction.reply({content: `Loadding your automod rule...`})
                        const word = options.getString('word')
                        const rule2 = await guild.autoModerationRules.create({
                        name: `prevent the word ${word} by: ${client.user.tag}`,
                        creatorId: `245339452464037888`,
                        enabled: true,
                        eventType: 1,
                        triggerType: 1,
                        triggerMetadata:
                            {
                                keywordFilter: [`${word}`]
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `This message was prevented by ${client.user.tag} Auto Moderation.`
                                    }
                                }
                            ]
                    }).catch(async err => {
                        setTimeout(async () => {
                            console.log(err);
                            await interaction.editReply({ content: `${err}`});
                        }, 2000)
                    })
                    setTimeout(async () => {
                        if (!rule2) return; 
                        const embed2 = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`You AutoMod rule has been created- all messages containing the word ${word} will be deleted by ${client.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL()})
                        await interaction.editReply({content: ``, embeds: [embed2]});
                    }, 3000)
                    } catch (error) {
                        console.log(error);
                        await interaction.folloUp({ content: `An error occurred while processing your request. Please try again in 5 seconds.` })
                        setTimeout(async () => {
                            await interaction.deteteReply().catch(() => {});
                        }, 5000);
                    }
                    break;
                    case 'spam-messages':
                        
                    try {
                        await interaction.reply({content: `Loadding your automod rule...`})
                        const rule3 = await guild.autoModerationRules.create({
                        name: `Prevent spam messages by: ${client.user.tag}`,
                        creatorId: `245339452464037888`,
                        enabled: true,
                        eventType: 1,
                        triggerType: 3,
                        triggerMetadata:
                            {
                                // mentionTotalLimit: number
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `This message was prevented by ${client.user.tag} Auto Moderation.`
                                    }
                                }
                            ]
                    }).catch(async err => {
                        setTimeout(async () => {
                            console.log(err);
                            await interaction.editReply({ content: `${err}`});
                        }, 2000)
                    })
                    setTimeout(async () => {
                        if (!rule3) return; 
                        const embed3 = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`You AutoMod rule has been created- all messages suspected of spam will be deleted by ${client.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL()})
                        await interaction.editReply({content: ``, embeds: [embed3]});
                    }, 3000)
                } catch (error) {
                    console.log(error);
                    await interaction.folloUp({ content: `An error occurred while processing your request. Please try again in 5 seconds.` })
                    setTimeout(async () => {
                        await interaction.deteteReply().catch(() => {});
                    }, 5000);
                }

                    break;


                    case 'mention-spam':
                        const aChannel = interaction.options.getChannel('mentions-alert');
                        const timeoutSecons = interaction.options.getInteger('timeout')
                        const timeoutM = (timeoutSecons*60);

                    try {
                        await interaction.reply({content: `Loadding your automod rule...`})
                        const rule4 = await guild.autoModerationRules.create({
                        name: `Prevent spam mentions by: ${client.user.tag}`,
                        creatorId: `245339452464037888`,
                        enabled: true,
                        eventType: 1,
                        triggerType: 1,
                        triggerMetadata:
                            {
                                regexPatterns: ["((<@[&!]?[\\d]+>\\s*){4,}|(<#[&!]?[\\d]+>\\s*){4,}|(<@&[\\d]+>\\s*){4,}|(@\\S+\\s*){4,})"]
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `This message was prevented by ${client.user.tag} Auto Moderation.`
                                    }
                                },
                                {
                                    type: 2,
                                    metadata: { channel: `${aChannel.id}`}
                                },
                                {
                                    type: 3,
                                    metadata: {
                                        durationSeconds: timeoutM || 60,
                                    }
                                }
                            ]
                    }).catch(async err => {
                        setTimeout(async () => {
                            console.log(err);
                            await interaction.editReply({ content: `${err}`});
                        }, 2000)
                    })
                    setTimeout(async () => {
                        if (!rule4) return; 
                        const embed4 = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`You AutoMod rule has been created- all messages suspetected of mention spam will be deleted. by ${client.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL()})
                        await interaction.editReply({content: ``, embeds: [embed4]});
                    }, 3000)
                } catch (error) {
                    console.log(error);
                    await interaction.folloUp({ content: `An error occurred while processing your request. Please try again in 5 seconds.` })
                    setTimeout(async () => {
                        await interaction.deteteReply().catch(() => {});
                    }, 5000);
                }
                    break;
    
                    case 'anti-links':
                        const permChannel = interaction.options.getChannel('channel');
                        const alertChannel = interaction.options.getChannel('alert-channel')
                    try {
                        await interaction.reply({content: `Loadding your AutoMod rule...`})
                        const rule5 = await guild.autoModerationRules.create({
                        name: `Prevent links by: ${client.user.tag}`,
                        creatorId: `245339452464037888`,
                        enabled: true,
                        eventType: 1,
                        triggerType: 1,
                        triggerMetadata:
                            {
                                regexPatterns: ['http'],
                                allowList: ['*.gif', '*.jpeg', '*.jpg', '*.png','.webp*', '*http://open.spotify.com/*', '*https://open.spotify.com/*', '*http://tenor.com/*', '*https://tenor.com/*']
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `This link was prevented by ${client.user.tag} Auto Moderation.`
                                    }
                                },
                                {
                                    type: 2,
                                    metadata: { channel: `${alertChannel.id}`}
                                }
                            ],
                        exemptChannels: permChannel ? [permChannel.id] : [],
                    }).catch(async err => {
                        setTimeout(async () => {
                            console.log(err);
                            await interaction.editReply({ content: `${err}`});
                        }, 2000)
                    })
                    setTimeout(async () => {
                        if (!rule5) return; 
                        const embed5 = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`You AutoMod rule has been created- all links now blocked. by ${client.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL()})
                        await interaction.editReply({content: ``, embeds: [embed5]});
                    }, 3000)
                    } catch (error) {
                        console.log(error);
                        await interaction.folloUp({ content: `An error occurred while processing your request. Please try again in 5 seconds.` })
                        setTimeout(async () => {
                            await interaction.deteteReply().catch(() => {});
                        }, 5000);
                    }
                    break;

                    case 'anti-invites':

                    try {
                        await interaction.reply({content: `Loadding your AutoMod rule...`})
                        const rule6 = await guild.autoModerationRules.create({
                        name: `Prevent invite link by: ${client.user.tag}`,
                        creatorId: `245339452464037888`,
                        enabled: true,
                        eventType: 1,
                        triggerType: 1,
                        triggerMetadata:
                            {
                                regexPatterns: ['discord(?:.com|app.com|.gg)[/invite/]?(?:[a-zA-Z0-9-]{2,32})']
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel,
                                        durationSeconds: 10,
                                        customMessage: `This discord invite was prevented by ${client.user.tag} Auto Moderation.`
                                    }
                                }
                            ]
                    }).catch(async err => {
                        setTimeout(async () => {
                            console.log(err);
                            await interaction.editReply({ content: `${err}`});
                        }, 2000)
                    })
                    setTimeout(async () => {
                        if (!rule6) return; 
                        const embed6 = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`You AutoMod rule has been created- all discord invites now blocked. by ${client.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL()})
                        await interaction.editReply({content: ``, embeds: [embed6]});
                    }, 3000)
                } catch (error) {
                    console.log(error);
                    await interaction.folloUp({ content: `An error occurred while processing your request. Please try again in 5 seconds.` })
                    setTimeout(async () => {
                        await interaction.deteteReply().catch(() => {});
                    }, 5000);
                }
                    break;
            }
        
        } catch (error) {
            await interaction.reply('I dont have perms to setUp AutoMod within this server')
        }
    }
}