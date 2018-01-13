var _ = require("underscore");
var persistencia=require("./persistencia.js");
var cf=require("./cifrado.js");
var moduloEmail=require("./email2.js");
var ObjectID=require("mongodb").ObjectID;

function Juego(com){
	this.partidas={};
	this.usuarios={};
	this.persistencia=new persistencia.Persistencia();
	this.com=com;
	this.obtenerUsuario=function(id){
		return _.find(this.usuarios,function(usu){
			return usu._id==id
		});
	}
	this.iniciarSesion=function(email,pass,callback){
		var ju=this;
		var passCifrada=cf.encrypt(pass);
	    this.persistencia.encontrarUsuarioCriterio({email:email,pass:passCifrada,confirmada:true},function(usr){
		    if (!usr){
	            callback({'email':''});
	        }
	        else{
	        	ju.usuarios[usr._id]=usr;	        	
	            callback(usr);
	        }
	    });
	}
	this.registrarUsuario=function(email,pass,callback){
		var ju=this;
		var passCifrada=cf.encrypt(pass);
		var key=(new Date().valueOf()).toString();
		var nick=email.substr(0,email.indexOf('@'));
		this.persistencia.encontrarUsuarioCriterio({email:email},function(usr){
			if(!usr){
				ju.persistencia.insertarUsuario({email:email,pass:passCifrada,nick:nick,key:key,confirmada:false},function(usu){
	                callback({email:'ok'});
	                moduloEmail.enviarEmail(usu.email,usu.key,"Confirme su correo en este enlace. ");
	                moduloEmail.enviarEmailAddor('jgallud@gmail.com',"Hay un nuevo usuario en AliensAttack: "+usu.email);
	            });
	        }
	        else{
	        	callback({email:undefined});
	        }
    	});
	}
	this.actualizarUsuario=function(nuevo,callback){
		//this.comprobarCambios(nuevo);
		//var usu=this;
		var oldC=cf.encrypt(nuevo.oldpass);
		var newC=cf.encrypt(nuevo.newpass);
		var pers=this.persistencia;
		var nick=nuevo.nick;

		this.persistencia.encontrarUsuarioCriterio({email:nuevo.email},function(usr){
			if(usr){
				if (nuevo.newpass!="" && nuevo.newpass==nuevo.newpass2){
					usr.pass=newC;
				}
				//console.log("nick: "+nick+" "+nuevo.nick);
				if (nuevo.nick!=""){
					usr.nick=nick;
				}
		        pers.modificarColeccionUsuarios(usr,function(nusu){
		               console.log("Usuario modificado");
		               callback(usr);
		        });
		    }
		    else{
		    	callback({email:undefined});	
		    }
		});
	}
	this.eliminarUsuario=function(uid,callback){
		var json={'resultados':-1};
		if (ObjectID.isValid(uid)){
			this.persistencia.eliminarUsuario(uid,function(result){
	            if (result.result.n==0){
	                console.log("No se pudo eliminar de usuarios");
	            }
	            else{
	                json={"resultados":1};
	                console.log("Usuario eliminado de usuarios");
	                callback(json);
	            }
	        }); 
		}
	    else{
	    	callback(json);
	    }
	}
	this.confirmarUsuario=function(email,key,callback){
		var pers=this.persistencia;
		this.persistencia.confirmarCuenta(email,key,function(usr){
	        if (!usr){
	            //console.log("El usuario no existe");
	            //response.send("<h1>La cuenta ya esta activada</h1>");
	            callback(undefined);
	        }
	        else{
	        	usr.confirmada=true;
	        	pers.modificarColeccionUsuarios(usr,function(result){
	        		callback(usr);
	        	});
	        }
	    });
	}
	this.reiniciarClaveYEnviar=function(email,callback){
		var key=(new Date().valueOf()).toString();
		var pers=this.persistencia;
		this.persistencia.encontrarUsuarioCriterio({email:email},function(usr){
	         if (!usr){
	            console.log("El usuario no existe");
	            //response.send({email:''});
	            callback({email:''});
	         }
	         else{      
	            //response.send({email:'ok'});
	            callback({email:'ok'});
	            moduloEmail.enviarEmailResetPassword(usr.email,key,"Al hacer click en el siguiente enlace, su clave pasará a ser: "+key+" No olvide de cambiarla cuanto antes: ");
	            usr.key=key;
	            usr.pass=cf.encrypt(key);
	            pers.modificarColeccionUsuarios(usr,function(result){});
	        }
	    });
	}
	this.cambiarClave=function(email,key,callback){
		var pers=this.persistencia;
		this.persistencia.encontrarUsuarioCriterio({email:email,key:key},function(usr){
	        if (!usr){
	            //console.log("El usuario no existe");
	            //response.send("<h1>La cuenta ya esta activada</h1>");
	            callback(undefined);
	        }
	        else{
	            usr.key="";
	            usr.pass="";	            
	            pers.modificarColeccionUsuarios(usr,function(result){});
	           //response.redirect("/");
	           callback(usr);
	        }
	    });
	}
	this.nuevaPartida=function(id,nombre,num,callback){
		if (this.usuarios[id]!=null){
			if (this.partidas[nombre]==null){
			//	socket.join(nombre);
				this.partidas[nombre]=new Partida(nombre,num);
			}
			//socket.join(nombre);
			callback(nombre)
		}
	}
	this.unirme=function(nombre,callback){
		//socket.join(nombre);
		callback(nombre);
	}
	this.obtenerPartidas=function(callback){
		var lista=[];
		for (var key in this.partidas) {
		    if (this.partidas[key].estado.esInicial()){
		    	lista.push(key);
		    }
		}
		callback(lista);
	}
	this.obtenerResultados=function(callback){
		this.persistencia.encontrarTodosResultados(function(result){
             //json=result;
             //res.send(json);
             callback(result);
        });
	}
	this.nivelCompletado=function(email,nivel,puntos,fecha,callback){		
		this.agregarResultado({email:email,nivel:parseInt(nivel),puntos:parseInt(puntos),fecha:fecha});
		callback('ok');
	}
	this.agregarResultado=function(res){
        this.persistencia.insertarResultado(res,function(usu){
            if(usu){
                console.log("Resultado insertado");
            }
            else{
                console.log("Problemas al insertar");            
            }   
        });
	}
	this.persistencia.conectar(function(db){
		console.log("conectado a la base de datos");
	});	
}

function Partida(nombre,num){
	this.jugadores={};
	this.nombre=nombre;
	this.numJugadores=num;
	this.estado=new Inicial();
	this.veg;//randomInt(0,35);
	this.ancho;
	this.alto;
	this.x;
	this.max;
	this.socket;
	this.puntos=0;
	this.alienX=20;
	this.alienY=2;
	this.duration=2000;
	this.bajada=10;
	this.balas=10;
	this.muertes=0;
	this.lapse=2000;
	this.vidas=3;
	this.io;
	this.conf;
	this.nivelCero=function(){
		this.puntos=0;
		this.alienX=20;
		this.alienY=2;
		this.duration=2000;
		this.bajada=10;
		this.balas=10;
		this.muertes=0;
		this.lapse=2000;
		this.vidas=3;
	}
	this.iniciar=function(x,y,callback){
		this.ancho=x;
		this.alto=y;
		//console.log("x: "+x+" y:"+y);
		this.ini();
		callback('coord',this.conf);
		// this.socket=socket;
		// this.io=io;
		// this.socket.emit('coord',this.conf);
	}
	this.agregarJugador=function(id,callback){
		//this.socket=socket;
		this.callback=callback;
		this.estado.agregarJugador(id,this);
	}
	this.puedeAgregarJugador=function(id){		
		var y=this.alto-30;
		this.x=(this.ancho/2)-10;
		if (this.jugadores[id]==null){
			this.jugadores[id]=new Jugador(id,this.x,y,this.vidas);
			this.veg++;
			this.x=(this.ancho/2)+10;;
		}
		//console.log(this.jugadores);
		if (Object.keys(this.jugadores).length>=this.numJugadores){
			this.estado=new Jugar();
			this.enviarAJugar();
		}
		else
			this.enviarFaltaUno();
	}
	this.enviarFaltaUno=function(){
		this.callback(this.nombre,'faltaUno',null);
		//this.io.sockets.in(this.nombre).emit('faltaUno');
	}
	this.enviarAJugar=function(){
		this.callback(this.nombre,'aJugar',this.jugadores);
		//this.io.sockets.in(this.nombre).emit('aJugar',this.jugadores);		
	}
	this.enviarQuitarBicho=function(ind,id,callback){
		//this.socket=socket;		
		//this.callback=callback;
		this.muertes=this.muertes+1;
		if (this.muertes>=this.max){
		 	this.estado=new Final();
		 	this.enviarFinal(id,callback);
		 	this.subirNivel(id);
		 }
		 else{
			callback(this.nombre,'quitarBicho',ind);
			//this.socket.broadcast.to(this.nombre).emit('quitarBicho',ind);
		}
	}
	this.enviarFinal=function(idGanador,callback){
		callback(this.nombre,'final',idGanador);
		//this.io.sockets.in(this.nombre).emit('final',idGanador);
	}
	this.finalVidas=function(idGanador){
		this.callback(this.nombre,'finalVidas',"-1");
		//this.io.sockets.in(this.nombre).emit('finalVidas',"-1");
	}
	this.movimiento=function(data,callback){
		this.callback=callback;
		this.estado.movimiento(data,this);
	}
	this.setPuntos=function(data,callback){
		//this.socket=socket;
		//this.callback=callback;
		this.estado.setPuntos(data,this);
	}
	this.setVidas=function(data,callback){
		//this.socket=socket;
		this.callback=callback;
		this.estado.setVidas(data,this);
	}
	this.ponerPuntos=function(data){
		this.puntos=this.puntos+1;
		//this.muertes=this.muertes+1;
		this.jugadores[data.id].ponerPuntos(this.puntos);
		 if (this.muertes>=this.max){
		 	this.estado=new Final();
		 	this.enviarFinal(data.id,this.callback);
		 	this.subirNivel(data.id);
		 }
		 else{
			this.callback(this.nombre,'puntos',data);
			//this.socket.broadcast.to(this.nombre).emit('puntos',data)
		}
	}
	this.ponerVidas=function(data){
		if (data.vidas<=0){
			this.estado=new Final();
			this.finalVidas(data.id,this.callback);
			//this.nivelCero();
			//this.jugadores[data.id].reset();
		}		
		else{
			this.callback(this.nombre,'vidas',data);
			//this.socket.broadcast.to(this.nombre).emit('vidas',data)
		}
	}
	this.puedeMover=function(data){
		if (data.vidas<=0){
			this.estado=new Final();
			this.finalVidas(data.id);
		}
		else{
			this.callback(this.nombre,'movimiento',data);
			//this.socket.broadcast.to(this.nombre).emit('movimiento',data)
		}
	}
	this.volverAJugar=function(callback){
		//this.socket=socket;
		this.callback=callback;
		this.estado.volverAJugar(this);
	}
	this.reset=function(){
		this.estado.reset(this);
	}
	this.subirNivel=function(id){
		//this.alienX++;
		//this.alienY++;
		this.jugadores[id].subirNivel();
		var nivel=this.jugadores[id].nivel;
		this.alienY=this.alienY+1;
		if (this.alienY>8){
			this.alienY=4;
		}
		this.duration=this.duration-300;
		if (this.duration<=600){
			this.duration=2000;
		}
		if (nivel>2){
			this.lapse=2000-nivel*100;
			if (this.lapse<=0){
				this.lapse=100;
			}
		}
		//console.log("duracion: "+this.duration);
		this.bajada=this.bajada+1;
		if (this.bajada > 60){
			this.bajada=50;
		}
		if (nivel>20 && (this.nivel%2==0)){
			this.balas=this.balas+1;
		}
	}
	this.reiniciar=function(){
		//this.jugadores={};
		//this.coord=[];
		this.x=(this.ancho/2)-10;
		this.puntos=0;
		this.muertes=0;		
		this.ini();
		//this.alienX=10;
		this.estado=new Inicial();
		this.callback(this.nombre,'reset',this.conf);
		//this.io.sockets.in(this.nombre).emit('reset',this.conf);
	}
	this.ini=function(){
		this.max=this.alienY*this.alienX;
		this.muertes=0;
		this.conf={alienX:this.alienX,alienY:this.alienY,duration:this.duration,bajada:this.bajada,balas:this.balas,lapse:this.lapse};
	}
	//this.ini();
}

function Inicial(){
	this.esInicial=function(){
		return true;
	}
	this.agregarJugador=function(id,juego){
		juego.puedeAgregarJugador(id);
	}
	this.movimiento=function(data,juego){
		console.log('No se admiten movimientos')
	}
	this.setPuntos=function(data,juego){
		console.log('No se admiten movimientos');
	}
	this.setVidas=function(data,juego){
		console.log('No se admiten movimientos');
	}
	this.reset=function(){
		console.log('Reset en estado Inicial');
	}
	this.volverAJugar=function(juego){
		juego.reiniciar();
	}
}

function Jugar(){
	this.esInicial=function(){
		return false;
	}
	this.agregarJugador=function(id,juego){
		console.log('No se puede agregar nuevo jugador');
	}
	this.movimiento=function(data,juego){
		juego.puedeMover(data);
	}
	this.setPuntos=function(data,juego){
		juego.ponerPuntos(data);
	}
	this.setVidas=function(data,juego){
		juego.ponerVidas(data);
	}
	this.reset=function(juego){
		juego.reiniciar();
	}
	this.volverAJugar=function(juego){
		juego.reiniciar();
	}
}

function Final(){
	this.esInicial=function(){
		return false;
	}
	this.agregarJugador=function(juego){
		console.log('No se puede agregar nuevo jugador');
	}	
	this.movimiento=function(data,juego){
		console.log('No se admiten movimientos')
	}
	this.volverAJugar=function(juego){
		juego.reiniciar();
	}
	this.setPuntos=function(data,juego){
		console.log('No se admiten movimientos');
	}
	this.setVidas=function(data,juego){
		console.log('No se admiten movimientos');
	}
}

function Jugador(id,x,y,vidas){
	this.id=id;
    this.x=x;
	this.y=y;
	this.puntos=0;
	this.puntosNivel=0;
	this.nivel=1;
	this.vidas=vidas;
	this.velocidad=200;
	this.ponerPuntos=function(puntos){
		this.puntosNivel=puntos;
	}
	this.subirNivel=function(){
		this.vidas=this.vidas+1;
		this.nivel=this.nivel+1;
		this.puntos=this.puntos+this.puntosNivel+20;
		if (this.nivel>15 && this.vidas<6){
			this.vidas=6;
		}
		this.puntosNivel=0;
		this.velocidad=this.velocidad+50;
	}
	this.reset=function(){
		//this.nivel=0;
		this.vidas=3;

	}
}

function randomInt(low, high){
   	return Math.floor(Math.random() * (high - low) + low);
}

module.exports.Juego=Juego;
module.exports.Partida=Partida;