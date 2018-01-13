var game;
var juego;
var finJuego;
var com;

function borrar(){
	$('#logo').remove();
	$("#cnt1").remove();
	$("#cnt2").remove();
	$("#cab").remove();
	$('#listaP').remove();
	$('#sel1').remove();
	$('#formSel').remove();
	$('#lbl').remove();
  	$('#par').remove();
	$('#nombre').remove();
	$('#nombreBtn').remove();
	$('#cab3').remove(); 
	$('#pie').remove();
}

function listaPartidas(lista){	

	var cadena="<div class='panel panel-default bg4' id='cab2'><div class='panel-body'>";
	cadena=cadena+"<h3>Partida multijugador</h3><img src='cliente/recursos/grupal.jpg' class='img-responsive' alt='individual'>";
	cadena=cadena+"<p><form class='form-inline'><div class='form-group'><label id='lbl'>Partida:</label> "
	cadena=cadena+'<input id="nombre" class="form-control" type="text" placeholder="un nombre cualquiera"></div> ';
	cadena=cadena+'<label>Jugadores:</label> <select class="form-control" id="sel2"> <option>1</option><option>2</option></select> ';
	cadena=cadena+"<button type='button' class='btn btn-primary' id='crearBtn'>Crear</button></form>";

	cadena=cadena+"<div id='listaP'><form class='form-inline'><select class='form-control' id='sel1'>"

	for(var i=0;i<lista.length;i++){
		cadena=cadena+"<option>"+lista[i]+"</option>"
	}
	cadena=cadena+"</select> ";
	cadena=cadena+"<button type='button' class='btn btn-primary' id='unirmeBtn'>Unirme a partida</button></form></p></div></div></div>";
	
	$('#partida2').append(cadena);
	$('#unirmeBtn').on('click',function(){
	  var nombre=$('#sel1').val();
	  if (nombre!=null){
		  borrar();
		  //cliente=new Cliente(nombre,-1);	  
		  cliente.ini(nombre,-1)
		  cliente.unirmeAPartida();
		  //enviarUnirmeAPartida(nombre);
		  mostrarCanvas();
		}
	});
	$('#crearBtn').on('click',function(){
	  var nombre=$('#nombre').val();
	  var num=$('#sel2').val();
	  if (nombre!=""){
		  borrar();   
	      cliente.ini(nombre,num);
		  mostrarCanvas();
	}
	});
}

function nombrePartida(){
	limpiar();
	var cadena="<div class='panel panel-default bg4' id='cab3'><div class='panel-body'><h3>Partida individual</h3>";
	cadena=cadena+"<p><img src='cliente/recursos/individual.jpg' class='img-responsive' alt='individual'></p>";
	cadena=cadena+'<button type="button" class="btn btn-primary" id="nombreBtn">Nueva partida</button></div></div>';

	$('#partida1').append(cadena);
	$('#nombreBtn').on('click',function(){
	  var nombre=(new Date().valueOf()).toString();//$('#nombre').val();
	  var num=$('#sel2').val();
	  if (nombre!=""){
		  borrar();   
	      cliente.ini(nombre,num)
		  //cliente=new Cliente(nombre,num);
		  //cliente.room=nombre;
		  //cliente.lanzarSocketSrv();	  
		  mostrarCanvas();
	}
	});
}

function mostrarCanvas(){
	game = new Phaser.Game("100%", "100%", Phaser.CANVAS, 'espacio');

	boot=new Boot();
	juego=new Juego();
	finJuego=new FinJuego();

	game.state.add('Boot',boot);
	game.state.add('Game',juego);
	game.state.add("FinJuego",finJuego);

	game.state.start('Boot');
	launchFullScreen(document.documentElement);
}

function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

