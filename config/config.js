var config = {};

config.cloudant = {};
config.cloudant.dbname = 'cane_passport';
config.cloudant.account = '40190322-3bdb-4a28-8c3c-1404b5ae2b26-bluemix';
config.cloudant.password = '2bf995ff354bf7b5550d21c5f2cbe64e503c26cf6edcb085aa90f3bb1fd73183';

config.admin_user = 'admin';
config.admin_pass = 'welcome';
config.index_field = 'username';
config.port = process.env.PORT || 3000;

module.exports = config;
