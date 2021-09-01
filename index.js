const server = require('./server.js');
var router = require("./router.js");
var handler = require("./handler.js");

var handle = {};

handle['/'] = handler.index;
handle['/index'] = handler.index;
handle['/formulario'] = handler.formulario;
handle['/buscar'] = handler.buscar;
handle['/actualizar'] = handler.actualizar;
handle['/buscarform'] = handler.buscarform;
handle['/borrar'] = handler.borrar;
handle['/actualizarform'] = handler.actualizarform;
handle['/borrarform'] = handler.borrarform;
handle['/actualizarformauto'] = handler.formModificarEncontrado;
handle['/mostrarTodos'] = handler.mostrarTodos;

server.iniciarServidor(router.enrutar,handle);


