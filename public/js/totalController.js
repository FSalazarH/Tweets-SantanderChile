
//mainAppControllers.controller('totalController', ['$scope', '$http',
mainAppControllers.controller('totalController',['$scope','$http',
    function ($scope, $http) {
        $scope.getDiasMes = function(mes){

            $http({method: 'GET', url:'/queryMonth/2017/'+mes}).
            success(function(data, status, headers, config){

                var jsonData = data.rows;

                var contadores = {"total": 0, "positive": 0, "negative": 0, "neutral": 0};

                var mes = {
                "1": {"positive": 0, "negative": 0, "neutral": 0},
                "2": {"positive": 0, "negative": 0, "neutral": 0},
                "3": {"positive": 0, "negative": 0, "neutral": 0},
                "4": {"positive": 0, "negative": 0, "neutral": 0},
                "5": {"positive": 0, "negative": 0, "neutral": 0},
                "6": {"positive": 0, "negative": 0, "neutral": 0},
                "7": {"positive": 0, "negative": 0, "neutral": 0},
                "8": {"positive": 0, "negative": 0, "neutral": 0},
                "9": {"positive": 0, "negative": 0, "neutral": 0},
                "10": {"positive": 0, "negative": 0, "neutral": 0},
                "11": {"positive": 0, "negative": 0, "neutral": 0},
                "12": {"positive": 0, "negative": 0, "neutral": 0},
                "13": {"positive": 0, "negative": 0, "neutral": 0},
                "14": {"positive": 0, "negative": 0, "neutral": 0},
                "15": {"positive": 0, "negative": 0, "neutral": 0},
                "16": {"positive": 0, "negative": 0, "neutral": 0},
                "17": {"positive": 0, "negative": 0, "neutral": 0},
                "18": {"positive": 0, "negative": 0, "neutral": 0},
                "19": {"positive": 0, "negative": 0, "neutral": 0},
                "20": {"positive": 0, "negative": 0, "neutral": 0},
                "21": {"positive": 0, "negative": 0, "neutral": 0},
                "22": {"positive": 0, "negative": 0, "neutral": 0},
                "23": {"positive": 0, "negative": 0, "neutral": 0},
                "24": {"positive": 0, "negative": 0, "neutral": 0},
                "25": {"positive": 0, "negative": 0, "neutral": 0},
                "26": {"positive": 0, "negative": 0, "neutral": 0},
                "27": {"positive": 0, "negative": 0, "neutral": 0},
                "28": {"positive": 0, "negative": 0, "neutral": 0},
                "29": {"positive": 0, "negative": 0, "neutral": 0},
                "30": {"positive": 0, "negative": 0, "neutral": 0},
                "31": {"positive": 0, "negative": 0, "neutral": 0}
                };
                
                for(var i=0; i<jsonData.length; i++){
                    var day = jsonData[i].key[2]; //Día
                    var sentiment = jsonData[i].key[3]; //Sentiment
                    var dayAux = day.toString();

                    switch(sentiment){
                        case 'positive':
                            mes[dayAux]['positive'] = mes[dayAux]['positive'] + jsonData[i].value;
                            contadores.positive = jsonData[i].value;
                            contadores.total = jsonData[i].value;
                            break;
                        case 'negative':
                            mes[dayAux]['negative'] = mes[dayAux]['negative'] + jsonData[i].value;
                            contadores.negative = jsonData[i].value;
                            contadores.total = jsonData[i].value;
                            break;
                        case 'neutral':
                            mes[dayAux]['neutral'] = mes[dayAux]['neutral'] + jsonData[i].value;
                            contadores.neutral = jsonData[i].value;
                            contadores.total = jsonData[i].value;
                            break;
                    }
                }
                
                $('#bar-chart-morris-2').empty();
                var bar = new Morris.Bar({
                  element: 'bar-chart-morris-2',
                  resize: true,

                  data: [
                    {y:'1', a: mes["1"].positive + mes["1"].negative + mes["1"].neutral},
                    {y:'2', a: mes["2"].positive + mes["2"].negative + mes["2"].neutral},
                    {y:'3', a: mes["3"].positive + mes["3"].negative + mes["3"].neutral},
                    {y:'4', a: mes["4"].positive + mes["4"].negative + mes["4"].neutral},
                    {y:'5', a: mes["5"].positive + mes["5"].negative + mes["5"].neutral},
                    {y:'6', a: mes["6"].positive + mes["6"].negative + mes["6"].neutral},
                    {y:'7', a: mes["7"].positive + mes["7"].negative + mes["7"].neutral},
                    {y:'8', a: mes["8"].positive + mes["8"].negative + mes["8"].neutral},
                    {y:'9', a: mes["9"].positive + mes["9"].negative + mes["9"].neutral},
                    {y:'10', a: mes["10"].positive + mes["10"].negative + mes["10"].neutral},
                    {y:'11', a: mes["11"].positive + mes["11"].negative + mes["11"].neutral},
                    {y:'12', a: mes["12"].positive + mes["12"].negative + mes["12"].neutral},
                    {y:'13', a: mes["13"].positive + mes["13"].negative + mes["13"].neutral},
                    {y:'14', a: mes["14"].positive + mes["14"].negative + mes["14"].neutral},
                    {y:'15', a: mes["15"].positive + mes["15"].negative + mes["15"].neutral},
                    {y:'16', a: mes["16"].positive + mes["16"].negative + mes["16"].neutral},
                    {y:'17', a: mes["17"].positive + mes["17"].negative + mes["17"].neutral},
                    {y:'18', a: mes["18"].positive + mes["18"].negative + mes["18"].neutral},
                    {y:'19', a: mes["19"].positive + mes["19"].negative + mes["19"].neutral},
                    {y:'20', a: mes["20"].positive + mes["20"].negative + mes["20"].neutral},
                    {y:'21', a: mes["21"].positive + mes["21"].negative + mes["21"].neutral},
                    {y:'22', a: mes["22"].positive + mes["22"].negative + mes["22"].neutral},
                    {y:'23', a: mes["23"].positive + mes["23"].negative + mes["23"].neutral},
                    {y:'24', a: mes["24"].positive + mes["24"].negative + mes["24"].neutral},
                    {y:'25', a: mes["25"].positive + mes["25"].negative + mes["25"].neutral},
                    {y:'26', a: mes["26"].positive + mes["26"].negative + mes["26"].neutral},
                    {y:'27', a: mes["27"].positive + mes["27"].negative + mes["27"].neutral},
                    {y:'28', a: mes["28"].positive + mes["28"].negative + mes["28"].neutral},
                    {y:'29', a: mes["29"].positive + mes["29"].negative + mes["29"].neutral},
                    {y:'30', a: mes["30"].positive + mes["30"].negative + mes["30"].neutral},
                    {y:'31', a: mes["31"].positive + mes["31"].negative + mes["31"].neutral}
                  ],
                  barColors: ['#AE50EC'],
                  xkey: 'y',
                  ykeys: ['a'],
                  labels: ['Total'],
                  hideHover: 'auto',
                  xLabelMargin: 5
                });

                /* Gráfico Donut Mensual */

                var a = Number($("#bar-chart-morris-2").height())/1.2;
                document.getElementById("donut-chart2").style.height = a.toString()   + "px";
                var donutData = [
                  {label: "Positivos", data: (contadores.positive*100)/contadores.total, color: '#00C851'},
                  {label: "Negativos", data: (contadores.negative*100)/contadores.total, color: '#DD4B39'},
                  {label: "Neutrales", data: (contadores.neutral*100)/contadores.total, color: '#9e9e9e'}
                ];

                $.plot("#donut-chart2", donutData, {
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

            }).
            error(function(data, status, headers, config){
                console.log("data:" +data.message);
            });
        };

        $scope.elegirMes = function(){
            $scope.eleccion = $scope.selectedMes;
            switch($scope.eleccion){
                case 'Enero':
                    $scope.getDiasMes("0");
                    break;
                case 'Febrero':
                    $scope.getDiasMes("1");
                    break;
                case 'Marzo':
                    $scope.getDiasMes("2");
                    break;
                case 'Abril':
                    $scope.getDiasMes("3");
                    break;
                case 'Mayo':
                    $scope.getDiasMes("4");
                    break;
                case 'Junio':
                    $scope.getDiasMes("5");
                    break;
                case 'Julio':
                    $scope.getDiasMes("6");
                    break;
                case 'Agosto':
                    $scope.getDiasMes("7");
                    break;
                case 'Septiembre':
                    $scope.getDiasMes("8");
                    break;
                case 'Octubre':
                    $scope.getDiasMes("9");
                    break;
                case 'Noviembre':
                    $scope.getDiasMes("10");
                    break;
                case 'Diciembre':
                    $scope.getDiasMes("11");
                    break;
            }
            $scope.getDiasMes($scope.eleccion);
        };


        $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo",
        "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        var todayDate = new Date();
        var todayMonth = todayDate.getMonth();
        $scope.mesActual = $scope.meses[todayMonth];
        $scope.eleccion = $scope.mesActual

        $scope.getDiasMes(todayMonth);


        //Para mantener tamano de grafico de dona y barra
        document.getElementById("donut2").style.height = $("#bar2").height()+ "px";
    }
]);