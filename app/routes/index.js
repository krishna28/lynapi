var User = require('../models/user');

// var Story = require('../models/project');

var config = require('../../config');

var jsonwebtoken =  require('jsonwebtoken');

var secureKey = config.secretkey;

var createToken  = function(user){

   var token = jsonwebtoken.sign({   
    id:user._id,
    name:user.name,
    username:user.username,
    roles:user.roles      
    },secureKey,{
        expiresInMinute:1400
    });

return token;
    
}


module.exports = function(app,express){
    
    var api = express.Router();
    
    api.post('/signup',function(req,res){

    var userRole = ["ROLE_USER"];     
    
    var user = new User({
        
        name:req.body.name,
        username:req.body.username,
        password:req.body.password,
        roles:userRole     
    });
        
        user.save(function(err){
        if(err){
        res.send(err);
          return;  
        }else{
         var token = createToken(user);
                res.status(200).json({ 
                    success:true,
                    message:"successfully login!",
                    token:token
                
                });    
            // res.json({message:"User created successfully"})
        }
        });    
    
    });
    
    
    
    api.post('/login',function(req,res){
    
    User.findOne({username:req.body.username}).select('password username name roles').exec(function(err,user){
    console.log("user",user)
    if(err){
        throw err;
    }
        if(!user){
        res.status(401).send({message:"user not found!"});
        }
        else{
            var isValidPassword = user.comparePassword(req.body.password);
            
            
            if(!isValidPassword){
                res.status(401).send({message:"invalid password!"});
            }else{
            
                var token = createToken(user);
                res.status(200).json({ 
                    success:true,
                    message:"successfully login!",
                    token:token
                
                });
            
            }
        }
    
    });
        
    });    
    
    return api;

}