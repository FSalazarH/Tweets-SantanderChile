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
    app.get('/queryTweetsbySentiment/:sentiment/:inicio/:fin', cloudant.tweets_by_sentiment);
    app.get('/queryMonth/:year/:month', cloudant.monthData);


    /* Query para ver los tweets de las últimas 24 horas */
    app.get('/queryliveTweets/:category', cloudant.live_tweets);

    /* Query para la data histórica del Bubble Chart */
    app.get('/queryTweetsCategorySentiment', cloudant.tweets_category_sentiment);
    app.get('/queryTotalLikesCategory', cloudant.totalLikesCategory);


    /* Vistas para la data dinámica de las últimas 24 horas del Bubble Chart */
    app.get('/queryTweetsCategorySentimentLast24', cloudant.tweets_category_sentiment_last24);
    app.get('/queryTotalLikesCategoryLast24', cloudant.totalLikesCategoryLast24);
};