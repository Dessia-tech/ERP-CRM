DessIA ERP-CRM (waiting for a better name)
==========================================

An open source ERP-CRM based on flask, with an optionnal UI in angular/bootstrap


Development usage
-----------------

 * clone this repo
 * start flask dev server with bash run.sh
 * start angular dev server by going into interface subfolder and run npm install and ng serve --open

Production usage
----------------

 * clone this repo
 * build front-end with ng build --prod
 * use wsgi to serve this flask application
