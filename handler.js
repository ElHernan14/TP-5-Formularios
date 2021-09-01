const http = require("http");
const pug = require("pug");
const url = require("url");
const fs = require('fs').promises;
const fss = require('fs');
const querystring = require("querystring");
const _ = require('lodash');

let htmllisto;
var test = ['asd','err','asd1'];
let patenteT;
function index(request,response){
    let modelos = {};
    fs.readFile('./modelos.json')
    .then((datos)=>{
        //CARGAR JSON
        modelos = JSON.parse(datos);
        //console.log(modelos.marcas);
    })
    htmllisto = pug.renderFile('./vistas/Formu.pug',{
        pretty:true,
        marcas : ['Audi','BMW','Citroen','Daihatsu','Dodge','Ford'],
        models:test
    });
    response.writeHead(200,{'Content-Type': 'Text/html'});
    response.write(htmllisto);
    response.end();
}

function formulario(request,response){
    let datos = "";
    request.on("data", (datosparciales) => {
        datos += datosparciales;
    });
    request.on("end", ()=>{
        let myObjectJson = [];
        const info = querystring.parse(datos);
        //Guardar JSON
        fs.readFile('./Datos.json')
        .then((datos) =>{
            if(datos != ''){
                myObjectJson= JSON.parse(datos);
            }
            let nuevosDatos = {
                patente:info.patente,
                color:info.color,
                nombre:info.nombre,
                marca:info.marca,
                modelo:info.modelo              
            };
            myObjectJson.push(nuevosDatos);
            let data = JSON.stringify(myObjectJson);
            return fs.writeFile('./Datos.json',`${data}`);
        })
        .then((datos) =>{
            console.log("Se pasaron los datos del auto");
        })
        //Renderizo la respuesta
        htmllisto = pug.renderFile('./vistas/datosAuto.pug',{
            pretty:true,
            ingresado:true,
            Nombre:info.nombre,
            Patente:info.patente,
            Marca:info.marca,
            Modelo:info.modelo,
            Color:info.color    
        });
        response.writeHead(200,{'Content-Type': 'Text/html'});
        response.write(htmllisto);
        response.end();
    })
}

//BUSCAR EN JSON
function buscar (request,response){
    htmllisto = pug.renderFile('./vistas/buscar.pug',{
        pretty:true
    })
    response.writeHead(200,{'Content-Type': 'Text/html'});
    response.write(htmllisto);
    response.end();
}

function buscarform(request,response){
    let datos = "";
    request.on("data", (datosparciales) => {
        datos += datosparciales;
    });
    request.on("end", ()=>{
        const info = querystring.parse(datos);
        const patente = info['patente'];
        let myObjectJson;
        let autos;
        //Guardar JSON
        fs.readFile('./Datos.json')
        .then((datos) =>{
            if(datos != ''){
                myObjectJson = JSON.parse(datos);
            }
            //console.log(myObjectJson)
            autos = _.findIndex(myObjectJson,function(o){
                return o.patente == patente;
            });
            if(autos != -1){
                htmllisto = pug.renderFile('./vistas/datosAuto.pug',{
                    pretty:true,
                    Nombre : myObjectJson[autos].nombre,
                    Patente : myObjectJson[autos].patente,
                    Color:myObjectJson[autos].color,
                    Marca : myObjectJson[autos].marca,
                    Modelo : myObjectJson[autos].modelo
                });
                response.writeHead(200,{'Content-Type': 'Text/html'});
                response.write(htmllisto);
                response.end();
            }else {
                const error = pug.renderFile('./vistas/Error.pug',{pretty:true});
                response.writeHead(500,{'Content-Type': 'Text/html'});
                response.write(error);
                response.end();   
            }        
        });  
    });
}

// BORRAR OBJETO EN JSON
function borrar (request,response){
    htmllisto = pug.renderFile('./vistas/borrar.pug',{
        pretty:true
    })
    response.writeHead(200,{'Content-Type': 'Text/html'});
    response.write(htmllisto);
    response.end();
}

function borrarform(request,response){
    let datos = "";
    request.on("data", (datosparciales) => {
        datos += datosparciales;
    });
    request.on("end", ()=>{
        const info = querystring.parse(datos);
        const patente = info['patente'];
        let myObjectJson;
        fs.readFile('./Datos.json')
        .then((datos) =>{
            if(datos != ''){
                myObjectJson = JSON.parse(datos);
            }
            console.log(myObjectJson)
            indBorrar = _.findIndex(myObjectJson,function(o){
                return o.patente == patente;
            });
            if (indBorrar != -1) {
                let valor = myObjectJson[indBorrar];
                let nuevosValores = _.remove(myObjectJson,function(o){
                    return o.patente != valor.patente
                })
                console.log(nuevosValores);
                let nuevo = JSON.stringify(nuevosValores);
                fss.writeFileSync('./Datos.json', `${nuevo}`);
                htmllisto = pug.renderFile('./vistas/respuesta.pug',{
                    pretty:true,
                    borrado:true
                })
                response.writeHead(200,{'Content-Type': 'Text/html'});
                response.write(htmllisto);
                response.end();
            }
            else{
                const error = pug.renderFile('./vistas/Error.pug',{pretty:true});
                response.writeHead(500,{'Content-Type': 'Text/html'});
                response.write(error);
                response.end();
            }           
        })
    });
}


// ACTUALIZAR JSON
function actualizarform(request,response){
    let datos = "";
    request.on("data", (datosparciales) => {
        datos += datosparciales;
    });
    request.on("end", ()=>{
        const info = querystring.parse(datos);
        const patente = info['patente'];
        let valor = false;
        const crew_json= fss.readFileSync('Datos.json');
        let objcrew = JSON.parse(crew_json);
        let index = _.findIndex(objcrew, function(o) { return o.patente == patente;});    
        if(index != -1){
            let resultado = objcrew[index].patente;
            patenteT = resultado;
            valor = true;
            htmllisto = pug.renderFile('./vistas/actualizar.pug',{
                pretty:true,
                valor:valor,
                marcas:['Audi','BMW','Citroen','Daihatsu','Dodge','Ford'],
            })
            response.writeHead(200,{'Content-Type': 'Text/html'});
            response.write(htmllisto);
            response.end();
        }
        else{
            const error = pug.renderFile('Error.pug',{pretty:true});
            response.writeHead(500,{'Content-Type': 'Text/html'});
            response.write(error);
            response.end();
        }     
    })
    
}

function actualizar(request,response){
    htmllisto = pug.renderFile('./vistas/actualizar.pug',{
        pretty:true,
        valor:false,
        marcas:['Audi','BMW','Citroen','Daihatsu','Dodge','Ford'],
    })
    response.writeHead(200,{'Content-Type': 'Text/html'});
    response.write(htmllisto);
    response.end();
}

function formModificarEncontrado(req, res){
        let info = "";
        req.on("data", (datosparciales) => {
        info += datosparciales;
        });
        req.on("end", () => {
        const formulario = querystring.parse(info);
        const crew_json= fss.readFileSync('Datos.json');
        //Cargo los datos del formulario
        let newDatos = {patente: `${formulario['patente']}`,
        color: `${formulario['color']}`,
        nombre: `${formulario['nombre']}`,
        marca: `${formulario['marca']}`,
        modelo: `${formulario['modelo']}`};
        console.log(newDatos);
        let objcrew = JSON.parse(crew_json);
        let index = _.findIndex(objcrew, function(o){ 
        return o.patente == patenteT;});
        console.log(index);
        if (index != -1) {
            resultado = objcrew[index].patente;
            let nuevojson = _.remove(objcrew, function(n) {
            return  n.patente != resultado;
            });
            nuevojson.push(newDatos);
            //console.log(nuevojson);
            let data = JSON.stringify(nuevojson);
            fss.writeFileSync('Datos.json',`${data}` );
            htmllisto = pug.renderFile('./vistas/respuesta.pug')
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(htmllisto);
            res.end(); 
        } else {
            const error = pug.renderFile('Error.pug',{pretty:true});
            response.writeHead(500,{'Content-Type': 'Text/html'});
            response.write(error);
            response.end();
        }   
    });
  }
  
  function mostrarTodos(request,response){
      let myObjectJson = [];
      fs.readFile('./Datos.json')
      .then((datos) =>{
          if(datos != ''){
              myObjectJson = JSON.parse(datos);
          }
            htmllisto = pug.renderFile('./vistas/mostrarTodos.pug',{
                pretty:true,
                listaDueños: myObjectJson
            });
            response.writeHead(200,{'Content-Type': 'Text/html'});
            response.write(htmllisto);
            response.end();        
      });  
  }

exports.index = index;
exports.formulario = formulario;
exports.buscar = buscar;
exports.buscarform = buscarform;
exports.borrar = borrar;
exports.borrarform = borrarform;
exports.actualizarform = actualizarform;
exports.actualizar = actualizar;
exports.formModificarEncontrado = formModificarEncontrado;
exports.mostrarTodos = mostrarTodos;

