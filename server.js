var express = require('express');
var app = express();
app.use(express.static('.'))
app.listen(3000, function(err){
    if (err) throw err;
    console.log('listening on ' + this.address().port);
});
