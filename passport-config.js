const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy
const {searchUser} = require('./controller/usersfunctions')


function initialize(passport){
 const authenticateUser = async (id, password, done) =>{
     const user = await searchUser(id)
     if( user == null){
        return done(null,false,{message: "failed to login"})
     }

     try {
        if(await bcrypt.compare(password, user.password)){
            return done(null,user)
        }else{
            return done(null,false,{message: "id or password incorrect"})
        }
     } catch (e) {
        return done(e)
     }

    }   
 passport.use(new localStrategy({usernameField: 'id'},authenticateUser))

 passport.serializeUser(function(user, done) {
   
   done(null, user.ID);
 });
 passport.deserializeUser(async (id, done) => done(null, await searchUser(id)))

}

module.exports = initialize