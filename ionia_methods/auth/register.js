const mongo = require('mongoose');

async function register(ctx, params) {
    if (!params.email) {
        console.log(400+' : email required');
        return false;
    }
    
    if (!params.password) {
        console.log(400+' : password required');
        return false;
    }
  
    const newUser = await mongo.model('User').create({
        email: params.email,
        password: bcrypt.hashSync(params.password, salt)
    });
    
    if (!newUser) {
        throw (409, 'The email has all ready been registered.');
    }

    return true;
}

exports.register = register;