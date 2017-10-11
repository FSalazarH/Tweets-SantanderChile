/**
 * Created by ChristopherMunozLeiv on 10/7/2017.
 */

mainAppControllers.controller('vivoController',['$scope','$rootScope','$http',

    function ($scope, $rootScope,$http) {

        var categoryQuery = ""; //Aca va el nombre de la categoria a consultar (puedes ver el arreglo de subCategorias con los nombres reales)
        var followersSentiment = [];

        //Función para llamar los tweets según categoría
        function getTweets(query){
            $http({method: 'GET', url:'/queryTweetsCategory/' + query}).
            success(function(data, status, headers, config){
                $scope.tweets = data;
            });
        };

        //Ejecución de la Query
        function getTweetsLikes(query){
            $http({method: 'GET', url:'/queryTweetsCategoryLikes/' + query}).
            success(function(data, status, headers, config){
                $scope.tweetsLikes = data;
            });
        }

        //Query ordenando por #retweets
        function getTweetsRetweets(query){
            $http({method: 'GET', url:'/queryTweetsCategoryRetweets/' + query}).
            success(function(data, status, headers, config){
                $scope.tweetsRetweets = data;
            });
        }


        //Tweets por sentimiento para modificar grafico bubble.
        function getTweetsSentiment(){

            $http({method: 'GET', url:'/queryTweetsCategorySentiment'}).
            success(function(data, status, headers, config){
                var positivo = "";
                var negativo = "";
                var neutral = "";
                var data =  data['rows'];
                for(var i=0; i<data.length; i++) {
                    var categoria = data[i]['key'][0];
                    var sentimiento = data[i]['key'][1];

                    var valor = data[i]['value'];

                    if(sentimiento == "negative"){

                        negativo+=  ',"'+ categoria + '":' + JSON.stringify(valor);
                    }else if(sentimiento == "positive"){
                        positivo+= ',"'+ categoria + '":' + JSON.stringify(valor);
                    }else if(sentimiento == "neutral"){
                        neutral+= ',"'+ categoria + '":' + JSON.stringify(valor);
                    };



                };

                negativo = JSON.parse( "{"+ negativo.slice(1) + "}");
                positivo = JSON.parse( "{"+ positivo.slice(1) + "}");
                neutral = JSON.parse( "{"+ neutral.slice(1) + "}");
                followersSentiment = [positivo,neutral,negativo];
            });
        }

        $scope.getTweetsRetweets = getTweetsRetweets;
        $scope.getTweetsLikes = getTweetsLikes;
        $scope.getTweets = getTweets;
        $scope.getTweetsSentiment = getTweetsSentiment;

        $rootScope.bubbleChart();





    }
]);
