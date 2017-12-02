var app = require('express')();
var router = require('./routes');

app.use('/', router);

app.listen(3000, function(){
    console.log("Swag Shop API running on port 3000...");
});

