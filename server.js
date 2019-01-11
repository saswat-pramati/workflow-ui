//Install express server
const express = require('express');
const path = require('path');
var workflow = require('./server/workflow');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors =  require('cors');

const app = express();

const PORT = 8080;

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/ch-ui'));

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/jso
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json

app.use(methodOverride());

app.use(cors({origin: '*'}));

app.use('/workflows', workflow);

// app.get('/*', function(req,res) {

//   res.sendFile(path.join(__dirname+'/dist/ch-ui/index.html'));
// });

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || PORT, () => {
  console.log('server started on port: ' + PORT);
});
