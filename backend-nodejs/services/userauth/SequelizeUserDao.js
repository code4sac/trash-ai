const bcrypt = require('bcrypt');
const UserLogin = require('../../sequelize/db/models').UserLogin;

module.exports = class AuthDao {
    
    static async addNewUser(username, password) {
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await UserLogin.create({ username: username, password: passwordHash });
            await newUser.save();
            return newUser;
        } 
        catch (error) {
            throw new Error(`Cannot create new user: ${error.message}`);
        }
    }

    static async getUserByUserName(username) {
        const userLogin = await UserLogin.findOne({ where: { username: username } });
        return userLogin; 
    }

    static async checkUserPassword( userObject, comparePassword) {
        const userPassword = userObject.password; 

        const passwordsMatch = await bcrypt.compare(comparePassword, userPassword);

        return passwordsMatch; 
    }
    
}
;

