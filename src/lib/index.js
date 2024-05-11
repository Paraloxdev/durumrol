// @ts-check

const { ChannelType, ActivityType, EmbedBuilder, Colors, time } = require('discord.js');
const { presence: { name }, guild: { guildId, channelId, roleId } } = require('../config');

module.exports = {
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @returns 
     */
    async presencesUpdate(client) {
        const guild = await client.guilds.fetch({ guild: guildId, force: true });
        const channel = await guild.channels.fetch(channelId);
        const role = await guild.roles.fetch(roleId);
        let index = 0; 
        /**
         * index değişkeni düzgün çalışmayabilir.
         */
        if (
            guild && role && channel && channel.type === ChannelType.GuildText
        ) {
            const listedPresences = guild.presences.cache.filter(member => !member.user.bot);

            for (const [ memberId, presence ] of listedPresences) {     
                index++;
                
                const member = await guild.members.fetch({ user: memberId, force: true });
                if (!member || member.user.bot) continue;

                const hasRole = member.roles.cache.has(roleId);

                const [ first ] = presence?.activities || [];
                const text = first?.type === ActivityType.Custom ? first?.state : first?.name;

                if (hasRole && text !== name) {
                    member.roles.remove(role, 'sdf\'s')
                    .then(() => {
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(Colors.DarkButNotBlack)
                                .setTitle('Bir kişi aramızdan ayrıldı 😥')
                                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                .setDescription(`• Gerekli roller, ${member.displayName}'ın/in durum mesajını **${name}** yapması nedeniyle kendisinden alındı.`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setFields([
                                    {
                                        name: 'Kullanıcı etiketi:',
                                        value: `> ${member.user.username}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Güncelleme saati:',
                                        value: `> ${time(parseInt(`${Date.now() / 1000}`), 'R')}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Toplam kişi:',
                                        value: `> ${index}.`,
                                        inline: true,
                                    },
                                ])
                                .setTimestamp()
                                .setFooter({ text: 'Bu projenin tanıtım videosu için youtube.com/@WraithsDev', iconURL: 'https://media.discordapp.net/attachments/1212116464354467891/1213016426185760799/MV5BM2Q3ZmE2NjYtOGM3OC00YmNkLThhZGEtMGI3YzBiNzRjZGIxXkEyXkFqcGdeQXVyNTM3MDMyMDQ._V1_.jpg?ex=65f3f094&is=65e17b94&hm=01081a4e0dce4a5577a964c617eca1ffd1fcf9f2420fdca103079194ad750831&=&format=webp&width=600&height=450' }),
                            ],
                          });
                        })
                        .catch(() => undefined);
                    
                    continue;
                }

                if (hasRole) continue;
                if (text !== name) continue;

                member.roles.add(role, 'sdf\'s')
                    .then(() => {
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(Colors.DarkButNotBlack)
                                .setTitle('Bir kişi daha aramıza katıldı 🎉')
                                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                .setDescription(`• Gerekli roller, ${member.displayName}'ın/in durum mesajını **${name}** yapması nedeniyle kendisine verildi.`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setFields([
                                    {
                                        name: 'Kullanıcı etiketi:',
                                        value: `> ${member.user.username}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Güncelleme saati:',
                                        value: `> ${time(parseInt(`${Date.now() / 1000}`), 'R')}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Toplam kişi:',
                                        value: `> ${index}.`,
                                        inline: true,
                                    },
                                ])
                                .setTimestamp()
                                .setFooter({ text: '', iconURL: '' }),
                            ],
                        })
                        .catch(() => undefined);
                    })
                    .catch(() => undefined);
              
            }
        }
    },
};