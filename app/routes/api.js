var User = require('../models/user');

var Project = require('../models/project');

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
    
    // api.post('/signup',function(req,res){

    // var userRole = ["ROLE_USER"];     
    
    // var user = new User({
        
    //     name:req.body.name,
    //     username:req.body.username,
    //     password:req.body.password,
    //     roles:userRole     
    // });
        
    //     user.save(function(err){
    //     if(err){
    //     res.send(err);
    //       return;  
    //     }else{
    //         var token = createToken(user);
    //             res.status(200).json({ 
    //                 success:true,
    //                 message:"successfully login!",
    //                 token:token
                
    //             });    
    //         // res.json({message:"User created successfully"})
        
    //     }
    //     });    
    
    // });
    
    api.get('/users',function(req,res){
    
        User.find({},function(err,users){
        
        if(err){
            res.status(200).send(err);
            return;
        }else{
            res.status(200).json(users);
        }
        
        })
    
    });
    
    
    // api.post('/login',function(req,res){
    
    // User.findOne({username:req.body.username}).select('password username name roles').exec(function(err,user){
    // console.log("user",user)
    // if(err){
    //     throw err;
    // }
    //     if(!user){
    //     res.status(401).send({message:"user not found!"});
    //     }
    //     else{
    //         var isValidPassword = user.comparePassword(req.body.password);
            
            
    //         if(!isValidPassword){
    //             res.status(401).send({message:"invalid password!"});
    //         }else{
            
    //             var token = createToken(user);
    //             res.status(200).json({ 
    //                 success:true,
    //                 username:user.username,
    //                 message:"successfully login!",
    //                 token:token
                
    //             });
            
    //         }
    //     }
    
    // });
        
    // });
    
    
    api.use(function(req,res,next){
        
        var token = req.body.token || req.headers['x-access-token'];
        console.log("middle token", token);
        if(token){
        
            jsonwebtoken.verify(token,secureKey,function(err,decoded){
            
              if(err){
               
                  res.status(403).send({success:false,message:"failed to authenticate"});
              
              }else{
              
              req.decoded = decoded; 
              next();
              }
            });
            
        }else{
        res.status(403).send({success:false,message:"no token provided"});
        }
    });
    

    
    //api chaining
    
    api.route('/project/:projectId?')
        
       .post(function(req,res){
    
        var project = new Project({
        creator:req.decoded.id,
        title:req.body.title,
        status:'NEW'       
        });
        
        project.save(function(err){
        if(err){
         res.status(500).send(err);
        }else{
        
        res.status(200).json({mesage:"Project Created"});
        }
        
        });
        })
       .put(function(req,res){
        if(req.params.projectId){
           console.log("body is",req.body);
          Project.update({_id:req.params.projectId},req.body,function(err,project){
            if(err){
             res.status(500).send(err);
            }else{     
             res.status(200).json(project);
            }
            });
        }else{
            res.status(403).send({message:"bad request"});
        }
    
        })
       .get(function(req,res){
        if(req.params.projectId){
            Project.findById(req.params.projectId).populate('experts.expert').exec(function(err,projects){
        
            if(err){
            res.status(500).send(err);
            }else{     
             res.status(200).json(projects);
            }
        
            })

        }else{
           Project.find({}).populate('experts.expert').exec(function(err,projects){
        
            if(err){
            res.status(500).send(err);
            }else{     
             res.status(200).json(projects);
            }
            });
    
        }
        });
    
      api.get('/me',function(req,res){
       res.json(req.decoded);
       });
    
    
    
    
    return api;

}