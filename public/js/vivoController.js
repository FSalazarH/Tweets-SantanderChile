/**
 * Created by ChristopherMunozLeiv on 10/7/2017.
 */



mainAppControllers.controller('categoryControllers',['$scope','$http',

    function ($scope, $http) {

        //Función para llamar los tweets según categoría
        function getTweets(query) {
            $http({
                method: 'GET',
                url: '/queryTweetsCategory/' + query
            }).success(function (data, status, headers, config) {
                $scope.tweets = data;
            });
        };

        //Ejecución de la Query
        function getTweetsLikes(query) {
            $http({
                method: 'GET',
                url: '/queryTweetsCategoryLikes/' + query
            }).success(function (data, status, headers, config) {
                $scope.tweetsLikes = data;
            });
        }

        //Query ordenando por #retweets
        function getTweetsRetweets(query) {
            $http({
                method: 'GET',
                url: '/queryTweetsCategoryRetweets/' + query
            }).success(function (data, status, headers, config) {
                $scope.tweetsRetweets = data;
            });
        }

        $scope.getTweetsRetweets = getTweetsRetweets;
        $scope.getTweetsLikes = getTweetsLikes;
        $scope.getTweets = getTweets;


    }
]);
