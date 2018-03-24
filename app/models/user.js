var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');

var rolesEnum = ['ROLE_USER','ROLE_ADMIN'];
var passwordregexwithmaxsize = /[a-z0-9]{8,}$/i
var passwordregex = /[a-z0-9]+$/i

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    username : {type:String,required:'username is required',index:{unique:true}},
    password : {type:String,required:true,minlength: [8, 'Min 8 character is required'],match:passwordregex,select:false},
    roles:[{
        type:String,
        enum:rolesEnum
    }]
});

userSchema.path('password').validate(function (value) {
    return value != this.username;
},'username and password cannot be same');

userSchema.pre('save',function(next){

    var user = this;
    
    bcrypt.hash(user.password,null,null,function(err,hash){
    if(err) {
        return next(err)
    }else{
     user.password = hash;    
     next();        
    }
        
    });

});

userSchema.methods.comparePassword = function(password){

    var user = this;
    return bcrypt.compareSync(password,user.password);

}

module.exports = mongoose.model('User',userSchema);