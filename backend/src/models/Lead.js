const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM(
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other"
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "contacted", "qualified", "lost", "won"),
      allowNull: false,
      defaultValue: "new",
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    lead_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    last_activity_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_qualified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.hasMany(Lead, { foreignKey: 'userId', as: 'leads' });
Lead.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Lead;
