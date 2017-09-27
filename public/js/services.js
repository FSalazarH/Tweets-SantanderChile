'use strict';

/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('mainAppControllers', []).service('graficService', function(){
    this.bubble = function (data,element,category) {
        var series = [];
        for(var i in category){
            var dato = {
                name: category[i],
                data: data[i],
                marker: {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[i]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            };
            series.push(dato)
        }


        Highcharts.chart(element, {
            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },
            credits: false,

            title: {
                text: 'Cantidad de seguidores vs Likes'
            },

            xAxis: {
                gridLineWidth: 1,
                title:{
                    text: 'Cantidad de Seguidores'
                }
            },
            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title:{
                    text: 'Número de Likes'
                }
            },
            plotOptions: {
                bubble: {
                    dataLabels: {
                        enabled: true,
                        style: { textShadow: 'none' },
                        formatter: function() {
                            return this.point.name;
                        }

                    },
                    minSize: '10%',
                    maxSize: '30%'
                }
            },
            series: series
        });
    };
});
