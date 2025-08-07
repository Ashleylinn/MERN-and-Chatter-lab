import { DataTypes } from '@sequelize/core';
import { sequelize } from '../database.js';

export const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});