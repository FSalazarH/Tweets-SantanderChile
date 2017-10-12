module.exports = function(app, cloudant) {
    //Lleva a la página principal
    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/totales', function(req, res){
        res.render('totales');
    });

    app.get('/categorias', function(req, res){
        res.render('categorias');
    });

    app.get('/tweets', function(req, res){
        res.render('tweets');
    });

    app.get('/sentiments', function(req, res){
        res.render('sentiments');
    });

    app.get('/vivo', function(req, res){
        res.render('vivo');
    });

    //Importante: Este es el get que obtiene los totales 
    app.get('/query', cloudant.queryTotales);
    //total de tweets No clasificados
    app.get('/queryNoClasificados', cloudant.noClasificados);
    //totales mensuales
    app.get('/queryTotalMensual', cloudant.totalMensual);

    app.get('/queryCategorias', cloudant.categorias);
    app.get('/queryAnio', cloudant.anio); //mejorar
    app.get('/queryTweetsCategory/:category', cloudant.tweets_category);
    app.get('/queryTweetsCategoryLikes/:category', cloudant.tweets_category_likes);
    app.get('/queryTweetsCategoryRetweets/:category', cloudant.tweets_category_retweets);

    //query for live tweets
    app.get('/queryliveTweets/:category', cloudant.live_tweets);


    app.get('/queryTweetsCategorySentiment', cloudant.tweets_category_sentiment);


    //bubble data
    app.get('/queryTotalLikesCategory', cloudant.totalLikesCategory);

    app.get('/queryTweetsbySentiment/:sentiment/:inicio/:fin', cloudant.tweets_by_sentiment);
    app.get('/queryMonth/:year/:month', cloudant.monthData);
};