require('dotenv').config({path: ".env.development"})

exports.URL_API_GETEWAY = process.env.SERVER === "dev" 
? "https://api-gateway-dev.franceverif.fr" 
: process.env.SERVER === "stage" 
? "https://api-gateway-stage.franceverif.fr" 
: "https://api-gateway.franceverif.fr"