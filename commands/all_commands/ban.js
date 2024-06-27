const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea al usuario especificado.")
    .addUserOption(option =>
      option
        .setName(`usuario`)
        .setDescription(`Usuario para Banear`)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName(`razon`).setDescription(`Razon del ban`)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  async run({ interaction, client }) {
    const user = interaction.options.getUser(`usuario`);
    const { guild } = interaction;

    let razon = interaction.options.getString(`razon`) || "No se justificó la razón.";
    if (user.id === interaction.user.id) {
      return interaction.editReply({
        content: `No puedes banearte a ti mism@.`,
        ephemeral: true,
      });
    }
    if (user.id === client.user.id) {
      return interaction.editReply({
        content: `No puedo banearme a mí mismo.`,
        ephemeral: true,
      });
    }

    try {
      await guild.bans.create(user.id, { reason: razon });

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
        .setTitle(`${user.tag} ha sido baneado del servidor.`)
        .setColor(0xd11775)
        .setTimestamp()
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: `Razón`, value: razon })


      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `Hubo un error al intentar banear al usuario.`,
        ephemeral: true,
      });
    }
  },
};
