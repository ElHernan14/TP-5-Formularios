const fs = require('fs');
const path = require('path');
const fss = require('fs').promises;

const mime = {
    '.html' : 'text/html',
    '.css'  : 'text/css',
    '.jpg'  : 'image/jpg',
    '.ico'  : 'image/x-icon',
    '.mp3'  :	'audio/mpeg3',
    '.mp4'  : 'video/mp4'
};
const cache = {};

function enrutar(handle,pathname,res,req){
    //console.log(pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](req, res);
    }
    else if (pathname == '/modelos'){
        fss.readFile('./modelos.json')
        .then((datos)=>{
            res.writeHead(200,{'Content-Type':'application/json'})
            res.write(datos);
            res.end();
        })
    }  
    else{
        let camino = 'static'+pathname;
        let extension = path.extname(camino);
        console.log(camino);
        if (cache[camino]) {
            res.writeHead(200,{'Content-Type':mime[extension]});
            res.write(cache[camino]);
            res.end();
        }else{
            fs.stat(camino,(error)=>{
                if(!error){
                    fs.readFile(camino,(error,contenido)=>{
                        if(error){
                            res.writeHead(500,{'Content-Type':'text/html'});
                            res.write(`<!doctype html><html><head></head><body>ERROR EN EL REQUERIMIENTO</body></html>`);
                            res.end();
                        }
                        else{
                            cache[camino]=contenido;
                            res.writeHead(200,{'Content-Type':mime[extension]});
                            res.write(contenido);
                            res.end();
                        }
                    });
                }
                else{
                    res.writeHead(404,{'Content-Type':'text/html'});
                    res.write(`<!doctype html><html><head></head><body>RUTA NO ESPECIFICADA</body></html>`);
                    res.end();
                }
            });
        }
    }
}

    

exports.enrutar = enrutar;