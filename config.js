var username = process.env.dbusername || "krishna";
var password = process.env.dbpassword || "passw0rd";
var dburi = "mongodb://".concat(username).concat(":").concat(password).concat("@ds123399.mlab.com:23399/pms")	
module.exports = {
"databaseUrl":dburi,    
"port":process.env.PORT || 3000,
"secretkey":"krishna@123"
}