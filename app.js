var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function processRequest(httpPostData, successCallback, errorCallback) {
    var Tproxy = require('./node_modules/temboo/core/tembooproxy');
    var Tsession = require('./node_modules/temboo/core/temboosession');
    var Google = require('./node_modules/temboo/Library/Google/Geocoding');

    // Initialize Temboo session
    var session = new Tsession.TembooSession("spocksbeard1306", "myFirstApp", "40i9Gs7dm6MJzA7hVWB8UgcOiOAavy90");

    // Initialize our request proxy
    var tembooProxy = new Tproxy.TembooProxy();

    // Instantiate the Choreo
    var geocodeByAddressChoreo = new Google.GeocodeByAddress(session);

    // Add Choreo proxy with an ID for the JS Library
    tembooProxy.addChoreo('jsGeocodeByAddress', geocodeByAddressChoreo);
    
    // Whitelist client inputs
    tembooProxy.allowUserInputs('jsGeocodeByAddress', 'Address');

    // Execute the requested Choreo
    tembooProxy.execute(httpPostData['temboo_proxy'], true, successCallback, errorCallback);
}
app.post('/proxy-server', function(req,res){
    console.log(JSON.stringify(req.body));
    processRequest(req.body,function(result){
        console.log('Sucess! ' + result);
        res.type('application/json');
        res.status(200).send(result);
    });
});
app.listen(8088, function(err){
    console.log('Hola mundo desde 8088');
});
