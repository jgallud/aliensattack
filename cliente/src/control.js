
function comprobarUsuario()
{
  limpiar();
  eliminarGame();
  com.srvComprobarUsuario();
  mostrarNavLogin();
}

function mostrarInfoGeneral(){
  limpiar();
  //mostrarIntro();
  var cadena="<div id='logo'><h1>AliensAttack</h1>"
  cadena=cadena+"<img src='cliente/recursos/logo.png' class='img-circle' alt='logo'>";
  cadena=cadena+"<h3>¿Hasta qué nivel eres capaz de llegar?</h3></div>";

  $('#cabecera').append(cadena);
}

function asociarEnter(idBoton){
  $(document).bind('keypress',function(e){
    if (e.keyCode==13){
      $(idBoton).trigger('click');
    }
  });
}


function mostrarLogin(){
  //borrarLogin();
  limpiar();
  asociarEnter('#nombreBtn');
  //mostrarIntro();
  var cadena="<div id='logo'><h1>AliensAttack</h1>"
  cadena=cadena+"<img src='cliente/recursos/logo.png' class='img-circle' alt='logo'></div>";
  $('#cabecera').append(cadena);

  var cadena='<div id="login">';
  cadena=cadena+'<h2 id="cabeceraP">Inicio de sesión</h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon" ><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" name="password" placeholder="Escribe tu clave"></div></div>';

  //$('#control').append('<p id="login"><h2 id="cabeceraP">Inicio de sesión</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email" required><input type="password" id="clave" class="form-control" placeholder="introduce tu clave" required></p>');
  $('#cabecera').append(cadena);
  $('#cabecera').append('<p id="nombreBtn"><button type="button" id="nombreBtn" class="btn btn-primary btn-md">Iniciar partida</button></p><a href="#" id="refRecordar">Recordar clave</a>');//' <a href="#" id="refRegistro" onclick="mostrarRegistro();">Registrar usuario</a>');
  $('#cabecera').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    if (testEmail.test(this.value) ) 
    {
      $('#nombreBtn').unbind("click").on('click',function(){
        var nombre=$('#email').val();
        var clave=$('#clave').val();
        //$('#nombre').remove();
        $('#login').remove();
        $('#nombreBtn').remove();   
        com.loginUsuario(nombre,clave);
      });
      $('#refRecordar').on('click',function(){
        var nombre=$('#email').val();        
        enviarClave(nombre);
        //mostrarRegistro();
      });
    }
    else {
      mostrarAviso("Debe ser una dirección de email");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function mostrarRegistro(){
  //borrarLogin();
  limpiar();
  var cadena="<div id='logo'><h1>AliensAttack</h1>"
  cadena=cadena+"<img src='cliente/recursos/logo.png' class='img-circle' alt='logo'></div>";
  $('#cabecera').append(cadena);
  asociarEnter('#regBtn');
  //  $('#home').append('<p id="cabecera"><h2 id="cabeceraP">Registro de usuarios</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email"><input type="password" id="clave" class="form-control" placeholder="introduce tu clave"></p>');
  var cadena='<div id="login">';
  cadena=cadena+'<h2 id="cabeceraP">Crear usuario nuevo</h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig12" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email2" type="text" class="form-control" name="email" placeholder="Repite el email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" placeholder="Escribe tu clave"></div></div>';

  //$('#control').append('<p id="login"><h2 id="cabeceraP">Inicio de sesión</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email" required><input type="password" id="clave" class="form-control" placeholder="introduce tu clave" required></p>');
  $('#cabecera').append(cadena);
 
  $('#cabecera').append('<button type="button" id="regBtn" class="btn btn-primary btn-md">Registrar usuario</button>');
  $('#cabecera').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email2').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var nombre=$('#email').val();
    var nombre2=$('#email2').val();
    if (testEmail.test(this.value)&&comprobarEmail(nombre,nombre2)) 
    {
        $('#regBtn').on('click',function(){  
          var clave=$('#clave').val();      
          $('#nombre').remove();
          $('#regBtn').remove();   
          com.registroUsuario(nombre,clave);
        });
    }
    else {
      mostrarAviso("Debe ser una dirección de email o las direcciones no coinciden");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function mostrarAviso(cadena){
  $("#info span").text(cadena);
}

function mostrarActualizarEliminar(){
  //borrarLogin();
  limpiar();
  var uid;
  if ($.cookie("usr")!=undefined){
    var usr=JSON.parse($.cookie("usr"));
    uid=usr._id;
  }
  //if ($.cookie('uid')!=undefined)
  if(uid!=undefined)
  {
    //$('#cabecera').append('<div class="container" id="cabeceraP"><div class="mainbox col-md-6 col-md-offset-3"><h2>Actualizar datos</h2><input type="text" id="email" class="form-control" placeholder="Email: '+usr.email+'"><input type="text" id="nombre" class="form-control" placeholder="Nombre: '+usr.nombre+'"><input type="password" id="newpass" class="form-control" placeholder="introduce tu nueva clave">');
    //$('#cabecera').append('<button type="button" id="actualizarBtn" class="btn btn-primary btn-md">Actualizar usuario</button> <button type="button" id="eliminarBtn" class="btn btn-danger btn-md">Eliminar usuario</button></div></div>');
    var cadena = '<div id="cabeceraP" class="bg4" style="padding-bottom:15px;">';
    cadena = cadena + '<h2>Actualizar datos del usuario</h2>';
    cadena = cadena + '<table class="table">';
    cadena = cadena + '<tr><td><label>Email: </label></td><td>'+usr.email+'</td></tr>';
    cadena = cadena + '<tr><td><label>Nick: </label></td><td><input type="text" id="nick" class="form-control" placeholder="Nick actual: '+usr.nick+'"></td></tr>';
    cadena = cadena + '<tr><td><label>Clave anterior: </label></td><td><input type="password" id="oldpass" class="form-control" placeholder="Clave anterior:"></span></td></tr>';
    cadena = cadena + '<tr><td><label>Nueva clave: </label></td><td><input type="password" id="newpass" class="form-control" placeholder="introduce tu nueva clave"></td></tr>';
    cadena = cadena + '<tr><td><label>Repite la nueva clave </label></td><td><input type="password" id="newpass2" class="form-control" placeholder="repite la nueva clave"></td></tr></table> ';
    cadena = cadena + '<p><button type="button" id="actualizarBtn" class="btn btn-primary btn-md">Actualizar usuario</button> <button type="button" id="eliminarBtn" class="btn btn-danger btn-md">Eliminar usuario</button></div>';
    cadena = cadena + '<h4 id="info"><span class="label label-warning"></span></h4>';
    $('#cabecera').append(cadena);
    $('#actualizarBtn').on('click',function(){
      var oldpass=$('#oldpass').val();
      var newpass=$('#newpass').val();
      var newpass2=$('#newpass2').val();
      var nick=$('#nick').val();
      //console.log("datos: "+oldpass+" "+newpass+" "+newpass2+" "+nick);
      if (oldpass=="" && newpass=="" && newpass2=="" && nick==""){
        mostrarAviso("No hay nada que modificar");
      }
      else{
        $('#actualizarBtn').remove();   
        com.actualizarUsuario(oldpass,newpass,newpass2,nick);
      }
    });
    $('#eliminarBtn').on('click',function(){
      var oldpass=$('#oldpass').val();
      if (oldpass!=""){
        //var clave=$('#clave').val();
        $('#nombre').remove();
        $('#eliminarBtn').remove();   
        com.eliminarUsuario();
      }
      else
        mostrarAviso('Introduce tu clave');
    });
  }
  else{
    mostrarLogin();
  }
}

function mostrarAviso(cadena){
  $("#info span").text(cadena);
}

function comprobarEmail(cad1,cad2){
  if (cad1==cad2){
    return true;
  }
  else{
    return false;
  }
}

function mostrarIniciarPartida(data){
  cliente=new Cliente(data._id);
  cliente.email=data.email;
  nombrePartida();
  com.obtenerPartidas();
  mostrarNavLogout();
}

function mostrarNavLogin(){
  var strLogin='<li><a href="#" onclick="mostrarRegistro();"><span class="glyphicon glyphicon-user-add"></span> Registrar usuario</a></li>';
  strLogin=strLogin+'<li><a href="#" onclick="mostrarLogin();"><span class="glyphicon glyphicon-log-in"></span> Iniciar sesión</a></li>';

  $('#inicio li').remove();
  $('#inicio').append(strLogin);
}

function mostrarNavLogout(){
  var strLogout='<li><a href="#" onclick="abandonar()"><span class="glyphicon glyphicon-user"></span> Abandonar partida</a></li>';
  strLogout = strLogout + '<li><a href="#" onclick="mostrarActualizarEliminar();"><span class="glyphicon glyphicon-user"></span> Modificar perfil</a></li>';
  strLogout = strLogout + '<li><a href="#" onclick="reset();"><span class="glyphicon glyphicon-log-out"></span> Salir</a></li>';

  $('#inicio li').remove();
  $('#inicio').append(strLogout);
}

function reset(){
  eliminarGame();  
  eliminarCookies(); 
  //mostrarNavLogin();
  comprobarUsuario();
  //location.reload();
}

function abandonar(){
  eliminarGame();  
  //location.reload(); 
}

function eliminarGame(){
  if (game && game.state!=null) {
    game.destroy();
    location.reload();
  }
}

function limpiar(){
  $('#login').remove();
  $('#nombre').remove();
  $('#nombreBtn').remove(); 
  $('#regBtn').remove();
  $('#refRecordar').remove();
  $('#info').remove();
  $('#logo').remove();
  $('#cab').remove();
  $('#listaP').remove();
  $("#cab2").remove();
  $("#cab3").remove();
  $("#tab").remove();
  $('#cabeceraP').remove();
  $('#actualizarBtn').remove();
  $('#eliminarBtn').remove();
}

function eliminarCookies(){
  $.removeCookie("usr");
  window.localStorage.clear();
}

function mostrarResultados(datos){
  eliminarGame();
  limpiar();

  //var cadena="<div class='panel panel-default' id='res'><div class='panel-heading'><h4>Resultados</h4></div>";
  //cadena=cadena+"<div class='panel-body'>";
  
  var cadena='<div id="tab" class="bg1"><h3>Resultados</h3><ul class="nav nav-tabs bg4">';
  cadena=cadena+'<li class="active"><a href="#todos" data-toggle="tab">Todos</a></li>'
  cadena=cadena+'<li><a href="#mislogros" data-toggle="tab">Mis logros</a></li>'
  cadena=cadena+'<li><a href="#losmejores" data-toggle="tab">Los mejores</a></li></ul>'
  cadena=cadena+'<div class="tab-content">';
  cadena=cadena+"<div class='tab-pane active' id='todos'>";
  cadena=cadena+obtenerTodos(datos);
  cadena=cadena+'</div>';
  cadena=cadena+"<div class='tab-pane' id='mislogros'>";
  cadena=cadena+obtenerMisLogros(datos);
  cadena=cadena+'</div>';
  cadena=cadena+"<div class='tab-pane' id='losmejores'>";
  cadena=cadena+obtenerLosMejores(datos);
  cadena=cadena+'</div>';
  cadena=cadena+'</div><div class="paging-container" id="demo"> </div>';
  cadena=cadena+'</div>';
  $('#resultados').append(cadena);  
  mostrarControlPaginas(datos.length); 
}

function mostrarControlPaginas(max){
  Pagination('#demo',{
          itemsCount: max,
          pageSize: 10,
          onPageSizeChange: function (ps) {
            console.log('changed to ' + ps);
          },
          onPageChange: function (paging) {
            //custom paging logic here
            //console.log(paging);
            var start = paging.pageSize * (paging.currentPage - 1),
              end = start + paging.pageSize,
              $rows = $('#table').find('.data');

            $rows.hide();

            for (var i = start; i < end; i++) {
              $rows.eq(i).show();
            }
          }
  });
}

function obtenerTodos(datos){
  var misDatos=(_.sortBy(datos,'puntos')).reverse();
  var cadena="<table id='table' class='table table-bordered table-condensed table-striped bg4'><thead><tr><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Puntos</th></tr></thead>";
  cadena=cadena+'<tbody>';
  for(var i=0;i<misDatos.length;i++){
      var fecha=new Date(misDatos[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      var nombre=misDatos[i].email.substr(0,misDatos[i].email.indexOf('@'));
      cadena=cadena+"<tr class='data'><td>"+nombre+"</td><td>"+strFecha+"</td><td> "+misDatos[i].nivel+"</td>"+"</td><td>"+misDatos[i].puntos+"</td></tr>";      
    }
    cadena=cadena+"</tbody></table>";
  return cadena;
}

function obtenerMisLogros(datos){
  var usr=JSON.parse($.cookie("usr"));
  var miEmail=usr.email;
  //var max=_.max(datos,function(ele){return ele.nivel});
  var nDatos=_.sortBy(_.filter(datos,function(each){
    return each.email==miEmail
  }),'puntos');

  var misDatos=nDatos.reverse();  
  var cadena="<table class='table table-bordered table-condensed table-striped bg4'><tr><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Puntos</th></tr>";
  for(var i=0;i<misDatos.length;i++){ 
      var fecha=new Date(misDatos[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      var nombre=misDatos[i].email.substr(0,misDatos[i].email.indexOf('@'));
      cadena=cadena+"<tr><td>"+nombre+"</td><td>"+strFecha+"</td><td> "+misDatos[i].nivel+"</td>"+"</td><td>"+misDatos[i].puntos+"</td></tr>";      
    }
    cadena=cadena+"</table>";
  return cadena;
}

function obtenerLosMejores(datos){
  var usr=JSON.parse($.cookie("usr"));
  var miEmail=usr.email;
  
  // for(var i=0;i<numero;i++){
  //   nuevaCol.push(_.filter(datos,function(ele){
  //     return ele.nivel;
  //   }))
  // }
  var tope;
  if (datos.length<10){
    tope=datos.length;
  }
  else
    tope=10;
  var nCol=_.sortBy(datos,'puntos');
  var nuevaCol=nCol.reverse(); 
  var cadena="<table class='table table-bordered table-condensed table-striped bg4'><tr><th>Puesto</th><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Puntos</th></tr>";
  for(var i=0;i<tope;i++){ 
      var fecha=new Date(nuevaCol[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      var nombre=nuevaCol[i].email.substr(0,nuevaCol[i].email.indexOf('@'));
      cadena=cadena+"<tr><td>"+(i+1)+"</td><td>"+nombre+"</td><td>"+strFecha+"</td><td> "+nuevaCol[i].nivel+"</td>"+"</td><td>"+nuevaCol[i].puntos+"</td></tr>";      
    }
    cadena=cadena+"</table>";
  return cadena;
}

