'use strict';
/* main App Controllers */
var mainAppControllers = angular.module('mainAppControllers', [ 'angular-flash.service', 'angular-flash.flash-alert-directive' ])
    .config(function (flashProvider) {
        // Support bootstrap 3.0 "alert-danger" class with error flash types
        flashProvider.errorClassnames.push('alert-danger');
    });


mainAppControllers.controller('sentimentsController', ['$scope', '$http',
    function ($scope, $http) {

        //Configuración del calendario
        var start = moment().subtract(29, 'days');
        var end = moment();
        function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            if(!$scope.$$phase){
                $scope.$apply(function (){
                    var inicio = new Date(start._d);
                    var fin = new Date(end._d);
                    var rangos = {"inicio": inicio.getTime(), "fin": fin.getTime()};
                    $scope.rangos = rangos;
                })
            }
        }

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
        
        cb(start, end);
        //Fin de Configuración del calendario

        function mostrarTweets(sentiment, inicio, fin){
            $http({method: 'GET', url:'/queryTweetsbySentiment/' + sentiment + '/' + inicio + '/' + fin}).
            success(function(data, status, headers, config) {
            
                //Obtención de la query
                var dataJSON = data;
                //Conversión de la fecha
                for(var i=0; i<dataJSON.length; i++){
                   var fecha = new Date(dataJSON[i].fecha);
                   dataJSON[i].fecha = fecha.toLocaleString();
                }

                //Muestra de datos para la vista
                $scope.tweets = dataJSON;

                //Detalle de datos para la vista
                switch($scope.data.sentiment){
                    case 'positive':
                        $scope.mostrarSentiment = 'Positivo';
                        break;
                    case 'negative':
                        $scope.mostrarSentiment = 'Negativo';
                        break;
                    case 'neutral':
                        $scope.mostrarSentiment = 'Neutral';
                        break;
                }
                $scope.cantidadTweets = $scope.data.cantidad;

            }).
            error(function(data, status, headers, config){
                console.log("data:" +data.message);
            }); 

        }

        $scope.cambiar = function(){
            mostrarTweets($scope.data.sentiment, $scope.rangos.inicio, $scope.rangos.fin);
        }

        $scope.data = {
            "sentiment" : 'positive'
        };

        mostrarTweets($scope.data.sentiment, '1498536000000', '1501127999999');
    }
]);

mainAppControllers.controller('mainController', ['$scope','$http', '$window',
    function ($scope, $http, $window) {
        //Obtención datos totales //Eliminar a futuro
        $http({method: 'GET', url:'/query'}).
        success(function(data, status, headers, config) {

            //Resultados Query para datos totales en bd tweetsclasificados
            var negativos = data["rows"][0]["value"]; 
            var neutros = data["rows"][1]["value"];
            var positivos  = data["rows"][2]["value"];
            var categorizados = negativos+positivos+neutros;

            $http({method: 'GET', url:'/queryNoClasificados'}).
            success(function(data, status, headers, config){
                var nocategorizados = data["total_rows"];
                $scope.nocategorizados = nocategorizados;
                $scope.tweetsTotales = nocategorizados + categorizados;
            }).
            error(function(data, status, headers, config){
            console.log("data:" +data.message);
            });

            //Variables para la vista
            $scope.positivosTotales = positivos;
            $scope.negativosTotales = negativos;
            $scope.neutrosTotales = neutros;    //Revisar
            $scope.categorizados = categorizados;

            var a = Number($("#bar-chart-morris").height())    /1.2;
            document.getElementById("donut-chart").style.height = a.toString()   + "px";
                        /* Gráfico Donut Anual */
            var donutData = [
              {label: "Positivos", data: (positivos*100)/categorizados, color: '#00C851'},
              {label: "Negativos", data: (negativos*100)/categorizados, color: '#DD4B39'},
              {label: "Neutrales", data: (neutros*100)/categorizados, color: '#9e9e9e'}
            ];
            $.plot("#donut-chart", donutData, {
              series: {
                pie: {
                  show: true,
                  radius: 1,
                  innerRadius: 0.5,
                  label: {
                    show: true,
                    radius: 2 / 3,
                    formatter: labelFormatter,
                    threshold: 0.1
                  }

                }
              },
              legend: {
                show: false
              }

            });

            function labelFormatter(label, series) {
                return '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">'
                + label
                + "<br>"
                + Math.round(series.percent) + "%</div>";
            }

            /* Fin Gráfico Donut Anual */

            /* Custom Label formatter (Porcentajes para Gráfico Donut) */
            //Fecha hoy
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd = '0'+dd
            }

            if(mm<10) {
                mm = '0'+mm
            }

            $scope.today = dd + '/' + mm + '/' + yyyy;

        }).
        error(function(data, status, headers, config){
            console.log("data:" +data.message);
        });

        $http({method: 'GET', url:'/queryTotalMensual'}).
        success(function(data, status, headers, config){
            var data = data;

            var totalMayo = data["rows"][0]["value"]+data["rows"][1]["value"]+data["rows"][2]["value"];
            var totalJunio = data["rows"][3]["value"] + data["rows"][4]["value"] + data["rows"][5]["value"];
            var totalJulio = data["rows"][6]["value"] + data["rows"][7]["value"] + data["rows"][8]["value"];
            var totalAgosto = data["rows"][9]["value"] + data["rows"][10]["value"] + data["rows"][11]["value"];

            /* Gráfico Barras Morris Anual */
            var bar = new Morris.Bar({
              element: 'bar-chart-morris',
              resize: true,
              data: [
                {y: 'Ene', a: 0, b: 0, c: 0},
                {y: 'Feb', a: 0, b: 0, c: 0},
                {y: 'Mar', a: 0, b: 0, c: 0},
                {y: 'Abr', a: 0, b: 0, c: 0},
                {y: 'May', a: data["rows"][0]["value"], b: data["rows"][2]["value"], c: data["rows"][1]["value"]},
                {y: 'Jun', a: data["rows"][3]["value"], b: data["rows"][5]["value"], c: data["rows"][4]["value"]},
                {y: 'Jul', a: data["rows"][6]["value"], b: data["rows"][8]["value"], c: data["rows"][7]["value"]},
                {y: "Ago", a: data["rows"][9]["value"], b: data["rows"][11]["value"], c: data["rows"][10]["value"]},
                {y: "Sep", a: 0, b: 0, c: 0},
                {y: "Oct", a: 0, b: 0, c: 0},
                {y: "Nov", a: 0, b: 0, c: 0},
                {y: "Dic", a: 0, b: 0, c: 0}
              ],
                barColors: ['#00C851', '#DD4B39', '#9e9e9e'],
              xkey: 'y',
              ykeys: ['a', 'b','c'],
              labels: ['Positivos', 'Negativos', 'Neutrales'],
              hideHover: "auto",
              xLabelMargin: 10
            });
            /* Fin Gráfico Barras Morris Anual */


        }).
        error(function(data, status, headers, config){


        });

        //Se encarga de mantener el tamaño de los graficos:
        document.getElementById("donut1").style.height = $("#bar1").height()+ "px";


    }
]);