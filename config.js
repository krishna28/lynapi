var username = process.env.username
var password = process.env.password
module.exports = {
"databaseUrl":"mongodb://"+username+":"+password+"@ds123399.mlab.com:23399/pms",    
"port":process.env.PORT || 3000,
"secretkey":"krishna@123"
}