import { Sequelize } from '@sequelize/core';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'chatter.sqlite',
});