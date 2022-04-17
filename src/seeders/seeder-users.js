'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'Khoa',
      lastName: 'Nguyen',
      address: 'Vietnam',
      phonenumber: '0123456789',
      gender: 1,
      image: 'ieukjfvfsk',
      roleId: 'R1',
      positionId: 'Doctor',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
