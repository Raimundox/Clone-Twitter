module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Likes, {       //Função hasMany representa que o usuario pode ter varios likes.
      onDelete: "cascade",             
    });

    Users.hasMany(models.Posts, {        //Função hasMany representa que o usuario pode ter varios Posts.
      onDelete: "cascade",
    });
  };

  return Users;
};