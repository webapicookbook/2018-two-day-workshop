/***********************************
 discovery westl document
 ***********************************/

var wstl = [
  {
    name : "home",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Home"
  },
  {
    name : "healthLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "HealthCheck"
  },
]; 

module.exports = wstl;

