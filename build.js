var fs = require('fs');
var npm = require('npm');
var clients = JSON.parse(fs.readFileSync('./src/assets/data/clients.json', 'utf8'));
var indexClients = [];
var counter = 0;

fs.createReadStream('.env').pipe(fs.createWriteStream('.env'));

npm.load({}, function (er) {
  if (er) { return; }
    
  for (let i in clients.clients) {
    indexClients.push(i);
  }

  rewrite(indexClients[0]);
});

function rewrite(client){
  var data  = "REACT_APP_CLIENT = '"+client+"'\r\n"; 
      data += "REACT_APP_LOCATION = 'tx'"; 

    fs.writeFile('.env', data, (err) => {
      if (err) throw err;
      console.log('Started with '+client+'!');
      npm.commands.run(['build'],() => {
        console.log("Finished "+client+"");
        if(counter < indexClients.length){
          counter++;
          rewrite(indexClients[counter]);
        }
      });
    });

}