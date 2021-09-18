'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkInsert('Messages', [
      {
        message: 'Hello from Sequelize!',
      }
    ], {});
  
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Messages', null, {});

  }
};
