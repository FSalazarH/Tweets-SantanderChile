//Query
var credenciales = 'https://4bbbd4c3-62d1-41b8-b551-4cdadcdea1da-bluemix:e8ea9241313975eece6cc3c8f884f86b4484c84b6fe6608653b407002578ebe3@4bbbd4c3-62d1-41b8-b551-4cdadcdea1da-bluemix.cloudant.com';

exports.anio = function(req, res){
    var request = require('request');
    var url = credenciales+'/clasificados/_design/docs/_view/totales_mensual?group=true';

    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};


//Totales tweets Clasificados
exports.queryTotales = function(req, res){
    var request = require('request');
    var url = credenciales+'/clasificados/_design/docs/_view/sentiment?group=true';

    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

//Totales tweets no Clasificados
exports.noClasificados = function(req, res){
    var request = require('request');
    var url = credenciales+'/noclasificados/_all_docs';
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

//Totales mensuales
exports.totalMensual = function(req, res){
    var request = require('request');
    var url = credenciales+'/clasificados/_design/docs/_view/totales_mensual?group=true&sort=key[0]&descending=false';

    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

exports.mes = function(req, res){
    var request = require('request');
    var fechaInicio;
    var fechaTermino;

    switch(req.params.mes){
        case "Mayo":
            fechaInicio = "1493607600000";
            fechaTermino = "1496203200000";
            break;
        case "Junio":
            fechaInicio = "1496289600000";
            fechaTermino = "1498795200000";
            break;
        case "Julio":
            fechaInicio = "1498881600000";
            fechaTermino = "1501473600000";
            break;
    }

    request(credenciales+'/clasificados/_design/docs/_view/tweets?startkey='+fechaInicio+'&&endkey='+fechaTermino+'&descending=false', function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

exports.categorias = function(req, res){
    var request = require('request');
    request(credenciales+'/clasificados/_design/tweets_category/_view/category_sentiment?group=True', function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

exports.tweets_category = function(req, res){
    var request = require('request');
    var category = req.params.category;
    var url = credenciales+'/clasificados/_design/tweets_category/_search/tweets_category?q=';

    var query = 'category:' + category + '&sort=["-followers_count"]&limit=10'
    request(url + query, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            var tweetsData = jsonData.rows;
            var array = [];

            for(var i=0; i<tweetsData.length; i++){
                array.push(tweetsData[i].fields);
                if(tweetsData[i].fields.sentiment  == "negative"){
                    array[i]["color"] = "#CC0000";
                }else if(tweetsData[i].fields.sentiment  == "neutral"){
                    array[i]["color"] = "#616161";
                }else{
                    array[i]["color"] = "#00a65a";
                };
            }

            res.json(array);
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });

};

exports.tweets_category_likes = function(req, res){
    var request = require('request');
    var category = req.params.category;
    var url = credenciales+'/clasificados/_design/tweets_category/_search/tweets_category?q=';
    var query = 'category:' + category + '&sort=["-likes_count"]&limit=10'
    request(url + query, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            var tweetsData = jsonData.rows;
            var array = [];

            for(var i=0; i<tweetsData.length; i++){
                array.push(tweetsData[i].fields);
                if(tweetsData[i].fields.sentiment  == "negative"){
                    array[i]["color"] = "#CC0000";
                }else if(tweetsData[i].fields.sentiment  == "neutral"){
                    array[i]["color"] = "#616161";
                }else{
                    array[i]["color"] = "#00a65a";
                };
            }
            res.json(array);
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });

};

exports.tweets_category_retweets = function(req, res){
    var request = require('request');
    var category = req.params.category;

    var url = credenciales+'/clasificados/_design/tweets_category/_search/tweets_category?q=';
    var query = 'category:' + category + '&sort=["-retweet_count"]&limit=10'
    request(url + query, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            var tweetsData = jsonData.rows;
            var array = [];

            for(var i=0; i<tweetsData.length; i++){
                array.push(tweetsData[i].fields);
                if(tweetsData[i].fields.sentiment  == "negative"){
                    array[i]["color"] = "#CC0000";
                }else if(tweetsData[i].fields.sentiment  == "neutral"){
                    array[i]["color"] = "#616161";
                }else{
                    array[i]["color"] = "#00a65a";
                };
            }
            res.json(array);
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

exports.tweets_by_sentiment = function(req, res){
    var request = require('request');
    var url = credenciales+"/clasificados/_design/docs/_view/sentiment_tweets?";
    var sentiment = req.params.sentiment;
    var inicio = req.params.inicio;
    var fin = req.params.fin;
    var startkey = 'startkey=["' + sentiment + '",' + fin + ']';
    var endkey = 'endkey=["' + sentiment + '",' + inicio + ']';
    var query = url + startkey + '&' + endkey + '&descending=true';
    request(query, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            var tweetsData = jsonData.rows;
            var array = [];

            for(var i=0; i<tweetsData.length; i++){
                array.push(tweetsData[i].value);
            }
            res.json(array);
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};



exports.tweets_category_sentiment = function(req, res){
    var request = require('request');
    request(credenciales + '/clasificados/_design/bubbleData/_view/sum_data_category_sentiment?group=True', function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};


exports.totalLikesCategory= function(req, res){
    var request = require('request');
    request(credenciales+'/clasificados/_design/bubbleData/_view/sum_data_category?group=true', function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

exports.totalCategory= function(req, res){
    var request = require('request');
    request(credenciales+'/clasificados/_design/bubbleData/_view/category_count?group=true', function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};

exports.monthData = function(req, res){
    var request = require('request');
    var year = req.params.year;
    var month = req.params.month;
    var url2 = credenciales+'/clasificados/_design/docs/_view/tweets_by_month?group=true';
    var startkey = '&startkey=['+year+','+month+',31]';
    var endkey = '&endkey=['+year+','+month+',0]';
    var url = url2 + startkey + endkey + '&descending=true';
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        else {
            console.log("Error "+response.statusCode);
        }
    });
};