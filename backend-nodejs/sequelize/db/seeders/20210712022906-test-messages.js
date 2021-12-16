'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkInsert('Messages', [
      {
        message: 'Hello from Sequelize! (1)',
      },
      {
        message: 'Hello from Sequelize! (2)',
      },
      {
        message: 'Hello from Sequelize! (3)',
      },
      {
        message: 'Hello from Sequelize! (4)',
      }
    ], {});
  
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Messages', null, {});

  }
};
