const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("desban")
        .setDescription("Desbanea al usuario especificado.")
        .addStringOption(option =>
            option
                .setName("usuario")
                .setDescription("ID del usuario para desbanear")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("razon").setDescription("Razón del desbaneo").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
    async run({ interaction, client }) {
        const userId = interaction.options.getString("usuario");
        const razon = interaction.options.getString("razon") || "No se justificó la razón.";
        const { guild } = interaction;

        try {
            const user = await interaction.guild.bans.remove(userId, razon);
            
            const embed = new EmbedBuilder()
                .setColor(0xd11775)
                .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
                .setTitle('Usuario Desbaneado')
                .setDescription(`El usuario <@${userId}> ha sido desbaneado del servidor.`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields({ name: `Razón`, value: razon })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(0xd11775)
                    .setTitle('Error')
                    .setDescription('Hubo un error al intentar desbanear al usuario. Es posible que el ID sea incorrecto o el usuario no esté baneado.')]

            });
        }
    },
};