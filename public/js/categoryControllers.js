mainAppControllers.controller('categoryControllers',['$scope','$rootScope','$http',

    function ($scope,$rootScope, $http) {

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
        $rootScope.prueba = 4;

        $('#follow-botton').click(function(){
            $('#like').collapse('hide');
            $('#retweets').collapse('hide');
            $('#follow').collapse('show');
        });

        $('#like-botton').click(function () {
            $('#follow').collapse('hide');
            $('#retweets').collapse('hide');
            $('#like').collapse('show');
        });

        $('#retweets-botton').click(function () {
            $('#follow').collapse('hide');
            $('#like').collapse('hide');
            $('#retweets').collapse('show');
        });
        //
        //Seccion para crear las categorias de la base de Datos y convertirlas a un diccionario:
        //

        var listaCategoriaBD = [
            "cajero","caida_portalSantander","servicios_portalSantander", "solicitudes_tarjeta",
            "transacciones_tarjeta", "clonacion_tarjeta",    "phishing", "sernac", "reclamo", "llamadas_vox",
            "login_portalSantander", "consultas",  "credito", "fraude", "seguros", "cuentaCorriente", "sucursal",
            "workCafe","chatOnline", "bloqueos_vox", "agradecimiento", "app", "beneficios"];
        var dato = '{"'+listaCategoriaBD[0] + '":{"total": 0, "positivos": 0, "negativos": 0, "neutrales": 0}';
        for(var i=1; i<listaCategoriaBD.length; i++){
            dato= (dato + ',"' + listaCategoriaBD[i] + '":{"total": 0, "positivos": 0, "negativos": 0, "neutrales": 0}');
        };
        dato = dato+'}';

        //Se crea el diccionario en base al string dato
        var subCategorias = JSON.parse(dato);
        var followers = {};
        var categoriasFollowers = [];

        getTweetsSentiment();  //0 -> positivo, 1 -> neutral, 2 -> negativo

        $rootScope.bubbleChart = function() {
            $http({
                method: 'GET',
                url: '/queryTotalLikesCategory'
            }).success(function (data, status, headers, config) {
                /*data para el tamaño de las burbujas*/
                var follows = "";
                var data = data['rows'];
                for(var i in data) {
                    var categoria = data[i];
                    follows += ',"' + categoria['key'] + '":' + JSON.stringify(categoria['value']);
                    categoriasFollowers.push(categoria['key']);
                };

                followers = JSON.parse('{' + follows.slice(1) + '}');

                $http({method: 'GET', url:'/queryCategorias'}).
                success(function(data, status, headers, config) {

                    var data_jerarquia = data["rows"];
                    var sentiment = "";
                    // Código para obtener los totales de cada subCategoria:

                    for(var i=0; i<data_jerarquia.length; i++) {
                        var subCategoria = data_jerarquia[i]["key"][0];
                        var sentimentSubcategoria = data_jerarquia[i]["key"][1];
                        if (sentimentSubcategoria == "negative") {
                            sentiment = "negativos";
                        } else if (sentimentSubcategoria == "positive") {
                            sentiment = "positivos";
                        } else {
                            sentiment = "neutrales"
                        }
                        ;

                        subCategorias[subCategoria][sentiment] += data_jerarquia[i]["value"];
                        subCategorias[subCategoria]["total"] += data_jerarquia[i]["value"];

                    };
                    $('#chart2').empty();

                    /* Gráfico Barras Morris */

                    /*Lista Categorias a ser mostradas en el grafico de barras: */
                    var listaJerarquias = ['Llamadas Vox', 'Bloqueos Vox',  'Sucursal', 'Cajero', 'WorkCafe',
                        'Aplicacion Santander', 'Login', 'Caida Portal',
                        'Servicios Portal', 'Chat Online',  'Cuenta Corriente', 'Credito',
                        'Seguros',  'Solicitudes', 'Transacciones', 'Clonacion',
                        'Fraude', 'Pishing', 'Sernac', 'Beneficios',
                        'Reclamos', 'Consultas', 'Agradecimientos',
                        'Portal Santander','Tarjeta','Atencion al Cliente',
                        'Seguridad','Productos Persona','Canales Criticos','Vox','Presencial','Categorias'];

                    //Se pasan a string para luego aplicar JSON.parse
                    var dato =  '{"'+listaJerarquias[0] + '":{"hijos":[],"datos":{"total": 0, "positivos": 0, "negativos": 0, "neutrales": 0}}';
                    for(var i=1; i<listaJerarquias.length; i++){
                        dato +=  ',"'+listaJerarquias[i] + '":{"hijos":[],"datos":{"total": 0, "positivos": 0, "negativos": 0, "neutrales": 0}}';
                    };
                    dato = dato+'}';

                    //Se crea el diccionario en base al string dato
                    var diccionario_categoria = JSON.parse(dato);

                    // Variable que suma los hijos de cada categoria

                    function SumaHijos(category){

                        var cat = diccionario_categoria[category];
                        for(var i in cat["hijos"]){
                            var nombre = cat["hijos"][i];
                            // Condicion para los ramas mas bajas del grafico
                            if(subCategorias[nombre]){
                                var hijo = subCategorias[nombre];
                                diccionario_categoria[category]["datos"].total += hijo.total;
                                diccionario_categoria[category]["datos"].positivos += hijo.positivos;
                                diccionario_categoria[category]["datos"].negativos += hijo.negativos;
                                diccionario_categoria[category]["datos"].neutrales += hijo.neutrales;



                                // Condicion para lsa ramas mas altas
                            }else if(diccionario_categoria[nombre]["datos"].total != 0){
                                var hijo2 = diccionario_categoria[nombre]["datos"];
                                diccionario_categoria[category]["datos"].total += hijo2.total;
                                diccionario_categoria[category]["datos"].positivos += hijo2.positivos;
                                diccionario_categoria[category]["datos"].negativos += hijo2.negativos;
                                diccionario_categoria[category]["datos"].neutrales += hijo2.neutrales;

                            }

                        };
                    };

                    //
                    // Funcion que entrega los hijos en un string unidos por un "or"
                    //
                    function ObtenerHijos(category){
                        var data = "";
                        var hijos = diccionario_categoria[category]["hijos"];
                        for(var i in hijos){
                            var hijo = hijos[i];
                            if(subCategorias[hijo]){
                                data += '*"' + hijo + '"';
                            }else{
                                data += ObtenerHijos(hijo);
                            };
                        };
                        return(data);
                    };

                    function ObtenerPreHijos(category){
                        var data = [];
                        var hijos = diccionario_categoria[category]["hijos"];

                        for(var i in hijos){
                            var hijo = hijos[i];
                            if(subCategorias[hijo]){
                                return [category];
                            }else{
                                data = data.concat(ObtenerPreHijos(hijo));
                            };
                        };
                        return(data);
                    };

                    function bubble(data,element,category) {
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
                            tooltip: {
                                useHTML: true,
                                headerFormat: '<table>',
                                pointFormat: '<tr><th colspan="2"><h4>{point.name}</h4></th></tr>' +
                                '<tr><th> N° Seguidores: </th><td>{point.x}</td></tr>' +
                                '<tr><th> N° Likes: </th><td>{point.y}</td></tr>' +
                                '<tr><th> N° Tweets: </th><td>{point.z}</td></tr>',
                                footerFormat: '</table>',
                                followPointer: true
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

                    function seriesBubble(categoria,sentiment){
                        var series = [];
                        var hijos = diccionario_categoria[categoria]['hijos'];
                        if(subCategorias[hijos[0]]){
                            hijos =[categoria];
                        };

                        for(var i in hijos){  //primero obtengo itero por cada hijo
                            var hijo= hijos[i];
                            var datos = [];

                            //subHijos = ObtenerHijos(hijo).replace(/\"/g,'').slice(1).split("*");
                            subHijos = ObtenerPreHijos(hijo);


                            //obtengo los hijos del hijo
                            for(var j in subHijos) {     //itero en estos subhijos
                                var name = subHijos[j];
                                var subHijo = diccionario_categoria[name]["hijos"][0];
                                var dato = {};
                                //ahora lo agrego a un archivo json:
                                if(followers[subHijo]){

                                    //0 -> positivo, 1 -> neutral, 2 -> negativo
                                    var data = followers[subHijo];
                                    var nulo = dato = {name: name,x: 0, y: 0, z: 0 };

                                    if(sentiment == "positivo"){
                                        var data2 = followersSentiment[0][subHijo];

                                        if(data2) {
                                            dato = {
                                                name: name,
                                                x: data2["followers"],
                                                y: data2["likes"],
                                                z: diccionario_categoria[name]["datos"]["positivos"]

                                            };

                                        }else{
                                            dato = nulo;
                                        };

                                    }else if(sentiment == "neutral"){
                                        var data2 = followersSentiment[1][subHijo];

                                        if(data2) {
                                            dato = {
                                                name: name,
                                                x: data2["followers"],
                                                y: data2["likes"],
                                                z: diccionario_categoria[name]["datos"]["neutrales"]
                                            };

                                        }else{
                                            dato = nulo;
                                        };
                                    }else if(sentiment == "negativo"){
                                        var data2 = followersSentiment[2][subHijo];

                                        if(data2) {
                                            dato = {
                                                name: name,
                                                x: data2["followers"],
                                                y: data2["likes"],
                                                z: diccionario_categoria[name]["datos"]["negativos"]
                                            };

                                        }else{
                                            dato = nulo;
                                        };
                                    }else{
                                        dato = {  //creo los datos     para 1 elemento de 1 serie del bubble
                                            name: name,
                                            x: data["followers"],
                                            y: data["likes"],
                                            z: diccionario_categoria[name]["datos"]["total"]
                                        };
                                    };

                                }else{
                                    dato = {  //creo los datos     para 1 elemento de 1 serie del bubble
                                        name: name,
                                        x: 0,
                                        y: 0,
                                        z: diccionario_categoria[name]["datos"]["total"]
                                    };
                                };

                                datos.push(dato);   //almaceno un conjunto de datos de 1 serie del bubble
                            }
                            series.push(datos); //guardo la serie
                        };
                        return series;
                    };
                    //
                    //Seteando el diccionario_categoria segun sus hijos:
                    //

                    //Categorias
                    diccionario_categoria['Categorias'].hijos =  ['Vox','Presencial','Canales Criticos','Productos Persona',
                        'Seguridad', 'Atencion al Cliente'];


                    //Vox
                    diccionario_categoria['Vox'].hijos = ['Llamadas Vox', 'Bloqueos Vox'];

                    //Precencial
                    diccionario_categoria['Presencial'].hijos = ['Sucursal', 'Cajero', 'WorkCafe'];

                    //Canales Criticos
                    diccionario_categoria['Canales Criticos'].hijos = ['Portal Santander', 'Aplicacion Santander','Chat Online'];

                    //Portal Santander
                    diccionario_categoria['Portal Santander'].hijos = ['Login', 'Caida Portal', 'Servicios Portal'];

                    //Productos Persona
                    diccionario_categoria['Productos Persona'].hijos = ['Cuenta Corriente', 'Credito','Seguros', 'Tarjeta','Beneficios'];

                    //'Atencion al Cliente'
                    diccionario_categoria['Atencion al Cliente'].hijos = ['Reclamos', 'Consultas', 'Agradecimientos'];

                    //Tarjeta
                    diccionario_categoria['Tarjeta'].hijos = ['Solicitudes', 'Transacciones', 'Clonacion'];

                    //Seguridad
                    diccionario_categoria['Seguridad'].hijos = ['Fraude', 'Pishing', 'Sernac'];
                    //Categorias de la BD
                    diccionario_categoria['Llamadas Vox'].hijos =  ['llamadas_vox'];
                    diccionario_categoria['Bloqueos Vox'].hijos = ['bloqueos_vox'];
                    diccionario_categoria['Sucursal'].hijos = ['sucursal'];
                    diccionario_categoria['Cajero'].hijos = ['cajero'];
                    diccionario_categoria['WorkCafe'].hijos = ['workCafe'];
                    diccionario_categoria['Login'].hijos = ['login_portalSantander'];
                    diccionario_categoria['Caida Portal'].hijos = ['caida_portalSantander'];
                    diccionario_categoria['Servicios Portal'].hijos = ['servicios_portalSantander'];
                    diccionario_categoria['Aplicacion Santander'].hijos = ['app'];
                    diccionario_categoria['Chat Online'].hijos = ['chatOnline'];
                    diccionario_categoria['Cuenta Corriente'].hijos = ['cuentaCorriente'];
                    diccionario_categoria['Credito'].hijos = ['credito'];
                    diccionario_categoria['Seguros'].hijos = ['seguros'];
                    diccionario_categoria['Solicitudes'].hijos = ['solicitudes_tarjeta'];
                    diccionario_categoria['Transacciones'].hijos = ['transacciones_tarjeta'];
                    diccionario_categoria['Clonacion'].hijos = ['clonacion_tarjeta'];
                    diccionario_categoria['Fraude'].hijos = ['fraude'];
                    diccionario_categoria['Pishing'].hijos = ['phishing'];
                    diccionario_categoria['Sernac'].hijos = ['sernac'];
                    diccionario_categoria['Reclamos'].hijos = ['reclamo'];
                    diccionario_categoria['Consultas'].hijos = ['consultas'];
                    diccionario_categoria['Agradecimientos'].hijos = ['agradecimiento'];
                    diccionario_categoria['Beneficios'].hijos = ['beneficios'];


                    //
                    //Fin de setiar el diccionario
                    //

                    //Suma los totales de los hijos y los entrega en diccionario categorias
                    for(var i in listaJerarquias){
                        SumaHijos(listaJerarquias[i]);
                    };

                    // Funcion que une los elementos del ser mostrados en el collapse chart
                    function funcollapse(nombre){
                        if(!(diccionario_categoria[nombre])){
                            return "";
                        };

                        var data = '{"name":"' + nombre + '"';
                        var hijos = diccionario_categoria[nombre]["hijos"];
                        ;
                        if(hijos){
                            if(subCategorias[hijos[0]]){
                                data+='}';
                                return data;
                            };
                            data += '   ,"children":[' + funcollapse(hijos[0]);


                            for(var i=1;i<hijos.length;i++){
                                var hijo=hijos[i];
                                data+="," + funcollapse(hijo);
                            }
                            data+=']}';
                            return data;
                        };
                        data+="}";
                        return data;
                    };


                    var dataOrg = [];
                    for(var i in diccionario_categoria["Categorias"]["hijos"]){
                        var nombre = diccionario_categoria["Categorias"]["hijos"][i];
                        var dato = diccionario_categoria[nombre]["datos"]
                        dataOrg.push({y: nombre, a: dato.positivos, b: dato.negativos, c: dato.neutrales});
                    };



                    // Funcion para crear grafico de morris con la data y el id del elemento html
                    function my_morrys_bar(data,element){
                        $('#' + element).empty();
                        if(!data){
                            return;
                        }
                        var count = data.length;
                        var keys = Object.keys(data[0]);
                        var i,e;
                        var bar = new Morris.Bar({
                            element: element,
                            resize: true,
                            barColors: ['#00C851', '#DD4B39', '#9e9e9e'],
                            data: data,
                            xkey: "y",
                            ykeys: ["a","b","c"],
                            labels: ['Positivos', 'Negativos', 'Neutrales'],
                            hideHover:'auto',
                            xLabelMargin: 10
                        });
                        return bar;
                    };

                    var bar = my_morrys_bar(dataOrg,"chart2");

                    //Seccion para cargar los tweets de categorias.
                    var sd ='(' + ObtenerHijos("Categorias").replace(/\*/g,'or').slice(2) + ')';

                    //Para iniciar el grafico de burbujas:
                    bubble(seriesBubble('Categorias'),"bubble2",diccionario_categoria["Categorias"]["hijos"]);
                    $scope.currentCategory = "Categorias";

                    getTweetsLikes(sd);
                    getTweets(sd);
                    getTweetsRetweets(sd);
                    $('#like').collapse('hide');
                    $('#follow').collapse('show');
                    $('#retweets').collapse('hide');


                    /* Fin Gráfico Barras Morris Anual */

                    //Se agregan los diferentes tipos de tweets a Categorias

                    // Variables para el collapse Chart

                    var data2= JSON.parse(funcollapse("Categorias"));
                    function Arbol(treeData) {
                        // Calculate total nodes, max label length
                        var totalNodes = 0;
                        var maxLabelLength = 0;

                        var i = 0;
                        var duration = 750;
                        var root;

                        // size of the diagram
                        var viewerWidth = $("#hierarchy").width();
                        var viewerHeight = 2*$("#chart2").height();

                        var tree = d3.layout.tree()
                            .size([viewerHeight, viewerWidth]);

                        // define las lineas.
                        var diagonal = d3.svg.diagonal()
                            .projection(function(d) {
                                return [d.y, d.x];
                            });

                        // A recursive helper function for performing some setup by walking through all nodes

                        function visit(parent, visitFn, childrenFn) {
                            if (!parent) return;

                            visitFn(parent);

                            var children = childrenFn(parent);
                            if (children) {
                                var count = children.length;
                                for (var i = 0; i < count; i++) {
                                    visit(children[i], visitFn, childrenFn);
                                }
                            }
                        }

                        // Call visit function to establish maxLabelLength
                        visit(treeData, function(d) {
                            totalNodes++;
                            maxLabelLength = Math.max(d.name.length, maxLabelLength);

                        }, function(d) {
                            return d.children && d.children.length > 0 ? d.children : null;
                        });

                        // Define the zoom function for the zoomable tree

                        function zoom() {
                            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        }

                        // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
                        var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
                        // define the baseSvg, attaching a class for styling and the zoomListener
                        var baseSvg = d3.select("#hierarchy").append("svg")
                            .attr("width", viewerWidth)
                            .attr("height", viewerHeight)
                            .call(zoomListener);

                        // Funcion para centrar el nodo clickeado
                        function centerNode(source) {
                            scale = zoomListener.scale();
                            x = -source.y0;
                            y = -source.x0;
                            x = x * scale + viewerWidth / 4;
                            y = y * scale +viewerHeight / 2;
                            d3.select('g').transition()
                                .duration(duration)
                                .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
                            zoomListener.scale(scale);
                            zoomListener.translate([x, y]);
                        }

                        // Funcion para expandir los nodos

                        function toggleChildren(d) {
                            if (d.children) {
                                d._children = d.children;
                                d.children = null;
                            } else if (d._children) {
                                d.children = d._children;
                                d._children = null;
                            }
                            return d;
                        }

                        // Toggle children on click.

                        function click(d) {
                            if (d3.event.defaultPrevented) return; // click suppressed
                            d = toggleChildren(d);
                            update(d);
                            centerNode(d);

                            if(d.name) {
                                var categoria = d.name.split(" (")[0];
                                var data3 = [];

                                //Datos para el grafico de barras morris

                                for(var i in diccionario_categoria[categoria]["hijos"]){
                                    var nombre = diccionario_categoria[categoria]["hijos"][i];
                                    if(diccionario_categoria[nombre]){
                                        var dato2 = diccionario_categoria[nombre]["datos"];
                                        data3.push({y: nombre ,a: dato2.positivos,b: dato2.negativos,c: dato2.neutrales});
                                    }else{
                                        var dato2= diccionario_categoria[categoria]["datos"];
                                        data3.push({y: categoria ,a: dato2.positivos,b: dato2.negativos,c: dato2.neutrales});
                                    };


                                };
                                $scope.currentCategory = categoria;
                                $('#like').collapse('hide');
                                $('#follow').collapse('show');
                                $('#retweets').collapse('hide');

                                if(data3){
                                    var bar = my_morrys_bar(data3, "chart2")

                                    var hijos= ObtenerHijos(categoria).replace(/\*/g,'or').slice(2);
                                    bubble(seriesBubble(categoria,'nn'),"bubble2",diccionario_categoria[categoria]["hijos"]);
                                    var sd ='(' + hijos + ')';
                                    getTweetsLikes(sd);
                                    getTweets(sd);
                                    getTweetsRetweets(sd)
                                };

                            };

                            $('#radio-todos').prop("checked", true);

                        }

                        function update(source) {
                            // Compute the new height, function counts total children of root node and sets tree height accordingly.
                            // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
                            // This makes the layout more consistent.
                            var levelWidth = [1];
                            var childCount = function(level, n) {

                                if (n.children && n.children.length > 0) {
                                    if (levelWidth.length <= level + 1) levelWidth.push(0);

                                    levelWidth[level + 1] += n.children.length;
                                    n.children.forEach(function(d) {
                                        childCount(level + 1, d);
                                    });
                                }
                            };
                            childCount(0, root);
                            var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
                            tree = tree.size([newHeight, viewerWidth]);

                            // Compute the new tree layout.
                            var nodes = tree.nodes(root).reverse(),
                                links = tree.links(nodes);

                            // Set widths between levels based on maxLabelLength.
                            nodes.forEach(function(d) {
                                d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
                                // alternatively to keep a fixed scale one can set a fixed depth per level
                                // Normalize for fixed-depth by commenting out below line
                                // d.y = (d.depth * 500); //500px per level.
                            });

                            // Update the nodes…
                            node = svgGroup.selectAll("g.node")
                                .data(nodes, function(d) {
                                    return d.id || (d.id = ++i);
                                });

                            // Enter any new nodes at the parent's previous position.
                            var nodeEnter = node.enter().append("g")
                                .attr("class", "node")
                                .attr("transform", function(d) {
                                    return "translate(" + source.y0 + "," + source.x0 + ")";
                                })
                                .on('click', click);

                            nodeEnter.append("circle")
                                .attr('class', 'nodeCircle')
                                .attr("r", 0)
                                .style("fill", function(d) {
                                    return d._children ? "lightsteelblue" : "#fff";
                                });

                            nodeEnter.append("text")
                                .attr("x", function(d) {
                                    return d.children || d._children ? -10 : 10;
                                })
                                .attr("dy", ".35em")
                                .attr('class', 'nodeText')
                                .attr("text-anchor", function(d) {
                                    return d.children || d._children ? "end" : "start";
                                })
                                .text(function(d) {
                                    return d.name;
                                })
                                .style("fill-opacity", 0);

                            // phantom node to give us mouseover in a radius around it
                            nodeEnter.append("circle")
                                .attr("r", 5)  // el rango del target
                                .attr("opacity", 0) // cambia a 0 para esconder el area
                                .style("fill", "red")
                                .attr('pointer-events', 'mouseover');


                            // Update the text to reflect whether node has children or not.
                            node.select('text')
                                .attr("x", function(d) {
                                    return d.children || d._children ? -10 : 10;
                                })
                                .attr("text-anchor", function(d) {
                                    return d.children || d._children ? "end" : "start";
                                })
                                .text(function(d) {

                                    //Muestra la cantidad de tweets de la categoria
                                    return d.name + " (" +  diccionario_categoria[d.name]["datos"]["total"] + ") ";
                                });

                            // Change the circle fill depending on whether it has children and is collapsed
                            node.select("circle.nodeCircle")
                                .attr("r", 4.5)
                                .style("fill", function(d) {
                                    return d._children ? "lightsteelblue" : "#fff";
                                });

                            // Transition nodes to their new position.
                            var nodeUpdate = node.transition()
                                .duration(duration)
                                .attr("transform", function(d) {
                                    return "translate(" + d.y + "," + d.x + ")";
                                });

                            // Fade the text in
                            nodeUpdate.select("text")
                                .style("fill-opacity", 1);

                            // Transition exiting nodes to the parent's new position.
                            var nodeExit = node.exit().transition()
                                .duration(duration)
                                .attr("transform", function(d) {
                                    return "translate(" + source.y + "," + source.x + ")";
                                })
                                .remove();

                            nodeExit.select("circle")
                                .attr("r", 0);

                            nodeExit.select("text")
                                .style("fill-opacity", 0);

                            // Update the links…
                            var link = svgGroup.selectAll("path.link")
                                .data(links, function(d) {
                                    return d.target.id;
                                });

                            // Enter any new links at the parent's previous position.
                            link.enter().insert("path", "g")
                                .attr("class", "link")
                                .attr("d", function(d) {
                                    var o = {
                                        x: source.x0,
                                        y: source.y0
                                    };
                                    return diagonal({
                                        source: o,
                                        target: o
                                    });
                                });

                            // Transition links to their new position.
                            link.transition()
                                .duration(duration)
                                .attr("d", diagonal);

                            // Transition exiting nodes to the parent's new position.
                            link.exit().transition()
                                .duration(duration)
                                .attr("d", function(d) {
                                    var o = {
                                        x: source.x,
                                        y: source.y
                                    };
                                    return diagonal({
                                        source: o,
                                        target: o
                                    });
                                })
                                .remove();

                            // Stash the old positions for transition.
                            nodes.forEach(function(d) {
                                d.x0 = d.x;
                                d.y0 = d.y;
                            });
                        }

                        // Append a group which holds all nodes and which the zoom Listener can act upon.
                        var svgGroup = baseSvg.append("g");

                        // Define the root
                        root = treeData;
                        root.x0 = viewerHeight;
                        root.y0 = 0;

                        // Layout the tree initially and center on the root node.

                        update(root);



                        // Para aumentar la distancia entre los nodos
                        function collapse(d) {
                            if (d.children) {
                                d._children = d.children;
                                d._children.forEach(collapse);
                                d.children = null;
                            }
                        }

                        root.children.forEach(collapse);
                        update(root);
                        centerNode(root);
                    };


                    Arbol(data2);



                    //Para mantener tamano de grafico de dona y barra
                    //document.getElementById("collap1").style.height =   $("#bar3").height()+ "px";

                    document.getElementById("tweetList1.5").style.height =  $("#chart2").height() - $("#tweetList2").height() + "px";
                    document.getElementById("tweetsList1").style.height = $("#chart2").height()+ "px";

                    console.log(followersSentiment);
                    //Click por sentimiento:
                    document.getElementById('radio-todos').onclick = function(){
                        bubble(seriesBubble($scope.currentCategory,'nn'),"bubble2",diccionario_categoria[$scope.currentCategory]["hijos"]);
                    };
                    document.getElementById('radio-positivo').onclick = function(){
                        bubble(seriesBubble($scope.currentCategory,'positivo'),"bubble2",diccionario_categoria[$scope.currentCategory]["hijos"]);
                    };

                    document.getElementById('radio-negativo').onclick = function(){
                        bubble(seriesBubble($scope.currentCategory,'negativo'),"bubble2",diccionario_categoria[$scope.currentCategory]["hijos"]);
                    };

                    document.getElementById('radio-neutral').onclick = function(){
                        bubble(seriesBubble($scope.currentCategory,'neutral'),"bubble2",diccionario_categoria[$scope.currentCategory]["hijos"]);
                    };



                });
            }).error(function (data, status, headers, config) {
                console.log("data:" + data.message);
            });
        };
        //
        //Fin de subcategorias
        //

        //Query para los datos por categoria
        $rootScope.bubbleChart();
    }
]);