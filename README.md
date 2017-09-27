# Proyecto Bluemix IBM-Chile (Students)

Proyecto para Banco Santander sobre análisis de Tweets. Este proyecto usa aplicaciones directas de Bluemix y es desarrollado a modo de CEAN stack (Cloudant, ExpressJS, AngularJS y NodeJS).

## Antes de comenzar

Es importante tener instalados algunas herramientas para administrar y ejecutar dependencias.

	-Git: https://git-scm.com/downloads
	-NodeJS: https://nodejs.org/es/
    -Bower (requiere NodeJS instalado): npm install -g bower

##Como ejecutarlo por primera vez:
Primero, clonar el repositorio:

	git clone https://www.github.com/sebaatd/Tweets-Santander

Abrir terminal como administrador en la carpeta del proyecto y ejecutar:

	'npm install'
	'bower install'

##Configurar Cloudant
Abrir el archivo ubicado en "config/config.js" y modificar los siguientes campos:

	config.cloudant.dbname = "cane_passport"
	config.cloudant.account = "usuarioCloudant"
	config.cloudant.password = "contraseñaCloudant"

Donde usuarioCloudant y contraseñaCloudant son las credenciales para acceder a la base de datos y cane_passport es una BD temporal.

## Correr la aplicación

Como cualquier aplicación express, ejecutar desde el terminal:

    'node app.js'

Finalmente abrir en el navegador: localhost:3000

Es recomendable instalar nodemon para no estar ejecutando el comando anterior cada vez que se haga un cambio:

	'npm install -g nodemon'

Esto reiniciará el servidor cada vez que se guarde algún cambio.

## Directorio
La estructura de trabajo es la siguiente:
    
    app.js              --> app config
    package.json        --> for npm
    bower.json          --> for static JS files
    public/             --> all of the files to be used in on the client side
      bootstrap/        --> all bootstrap files
        css/
        img/
        js/
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      js/               --> javascript files
        app.js          --> declare top-level app module
        controllers.js  --> application controllers
        directives.js   --> custom angular directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
        dashboard.js    --> script dashboard
        liquidFillGauge.js --> script gauges
    routes/
      cloudant.js            --> route for serving JSON, contains Cloudant configuration
      routes.js         --> route for serving HTML pages and partials
    views/
      index.html        --> main page for app

## Sobre la fecha y hora del Tweet:

En algunos casos, la fecha que se registra desde twitter no coincide con la de nuestra zona horaria,
en nuestra estructura de la base de datos usar payload.created_at, esta será la hora real del tweet.
