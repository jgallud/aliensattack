function ComSrv(){
	this.lanzarSocketSrv=function(io,juego){
		io.on('connection',function(socket){
		    socket.on('room', function(id,room,num) {
		        console.log('nuevo cliente: ',id,room,num);
		        //socket.join(room);
		        juego.nuevaPartida(id,room,num,function(nombre){
		        	socket.join(nombre);
		        });
		    });
		    socket.on('unirme',function(room){
		        //console.log(juego.partidas);
		        juego.unirme(room,function(nombre){
		        	socket.join(nombre);
		        });
		    });
		    socket.on('configuracion',function(room,x,y){
		        //console.log(juego.partidas);
		        if (juego.partidas[room]){
		            juego.partidas[room].iniciar(x,y,function(mens,col){
		            	socket.emit(mens,col);
		            });
		        }
		    })
		    socket.on('nuevoJugador',function(data){        
		         if (juego.partidas[data.room]){
		            juego.partidas[data.room].agregarJugador(data.id,function(nombre,mens,col){
		            	io.sockets.in(nombre).emit(mens,col);
		            });
		        }
		    });
		    socket.on('matarBicho',function(room,ind,id){
		         if (juego.partidas[room]){
		            juego.partidas[room].enviarQuitarBicho(ind,id,function(nombre,mens,val){
		            	io.sockets.in(nombre).emit(mens,val);
		            });
		        }
		    });
		    socket.on('posicion',function(room,data){
		        if (juego.partidas[room]){
		            juego.partidas[room].movimiento(data,function(nombre,mens,valor){
		            	socket.broadcast.to(nombre).emit(mens,valor);
		            });
		        }
		    });
		    socket.on('envPuntos',function(room,data){
		        if (juego.partidas[room]){
		            juego.partidas[room].setPuntos(data,function(nombre,mens,val){
		            	socket.broadcast.to(nombre).emit(mens,val);
		            });
		        }
		    });
		    socket.on('envVidas',function(room,data){
		        if (juego.partidas[room]){
		            juego.partidas[room].setVidas(data,function(nombre,mens,val){
		            	//socket.broadcast.to(nombre).emit(mens,val);
		            	io.sockets.in(nombre).emit(mens,val);
		            });
		        }
		    });
		    socket.on('volverAJugar',function(room){
		        //juego=new modelo.Juego();
		         if (juego.partidas[room]){
		            juego.partidas[room].volverAJugar(function(nombre,mens,val){
		            	io.sockets.in(nombre).emit(mens,val);
		            });
		        }
		    });
		});
	}

}

module.exports.ComSrv=ComSrv;