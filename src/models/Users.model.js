const prisma = require('./prismaClient');

module.exports = {
  async getAllUsers() {
    try {
      const users = await prisma.users.findMany(); 
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};
