function Com(){
	this.obtenerPartidas=function(){
  		$.getJSON("/obtenerPartidas",function(data){    
        	listaPartidas(data);
  		});
	}
	this.loginUsuario=function(nombre,clave){
	  $.ajax({
	    type:'POST',
	    url:'/login/',
	    data:JSON.stringify({email:nombre,password:clave}),
	    success:function(data){
	      if (data.email==""){
	        mostrarLogin();
	      }
	      else{
	        console.log('el usuario ha iniciado la sesión');
	        $.cookie("usr",JSON.stringify(data));
	        mostrarIniciarPartida(data);        
	       }
	      },
	    contentType:'application/json',
	    dataType:'json'
	  });
	}
	this.registroUsuario=function(nombre,clave){
	  $.ajax({
	    type:'POST',
	    url:'/registro/',
	    data:JSON.stringify({email:nombre,password:clave}),
	    success:function(data){
	      if (data.email==undefined){
	        mostrarRegistro();
	        //mostrarAviso("Dirección de email inventada o el usuario ya existe");
	        //mostrarSolicitarReenvioMail();
	      }
	      else{        
	         //mostrarLogin();
	         mostrarAviso("Te hemos enviado un email para confirmar tu cuenta");
	      }
	      },
	    contentType:'application/json',
	    dataType:'json'
	  });
	}
	this.srvComprobarUsuario=function(){
	  if ($.cookie("usr")!=undefined){
	    var usr=JSON.parse($.cookie("usr"));
	    var id=usr._id;//$.cookie("uid");
	  }
	  else
	    id=-1;  

	  $.getJSON('/comprobarUsuario/'+id,function(data){
	    if (data.email==""){
	      eliminarCookies();
	      mostrarInfoGeneral();
	    }
	    else{
	      mostrarIniciarPartida(data);
	    }
	  });
	}
	this.obtenerResultados=function(){
	  var uid;
	  if ($.cookie("usr")!=undefined){
	    var usr=JSON.parse($.cookie("usr"));
	    uid=usr._id;
	  }
	  if (uid!=undefined){
	    $.getJSON("/obtenerResultados/"+uid,function(data){           
	        mostrarResultados(data);
	    });
	  }
	  else
	    mostrarAviso("Debes iniciar sesión");
	}
	this.comunicarNivelCompletado=function(nivel,puntos){
	  if ($.cookie("usr")!=undefined){
	    var usr=JSON.parse($.cookie("usr"));
	    var uid=usr._id;
	    $.getJSON('/nivelCompletado/'+uid+"/"+nivel+"/"+puntos,function(datos){
	        obtenerResultados()
	    });
	  } 
	}
	this.enviarClave=function(email){
	  if (email==undefined){
	    mostrarLogin();
	    mostrarAviso("Introduce usuario");
	  }
	  else{
	    $.getJSON("/enviarClave/"+email,function(data){    
	        if (data.email==""){
	          mostrarRegistro();
	          mostrarAviso("El usuario no existe en el sistema");	          
	        }
	        else{
	           mostrarLogin();
	           mostrarAviso("Te hemos enviado un email para confirmar tu cuenta");
	        }
	      });
	  }
	}
	this.actualizarUsuario=function(oldpass,newpass,newpass2,nick){
	  var usr=JSON.parse($.cookie("usr"));
	  var nivel=usr.nivel;
	 $.ajax({
	    type:'PUT',
	    url:'/actualizarUsuario',
	    data:JSON.stringify({uid:usr._id,email:usr.email,nick:nick,oldpass:oldpass,newpass:newpass,newpass2:newpass2}),
	    success:function(data){
	      if (data.email==undefined){
	        mostrarRegistro();
	      }
	      else{
	        $.cookie("usr",JSON.stringify(data));
	        mostrarIniciarPartida(data);
	      }
	      },
	    contentType:'application/json',
	    dataType:'json'
	  });
	}
	this.eliminarUsuario=function(){
	  var usr=JSON.parse($.cookie("usr"));
	  $.ajax({
	    type:'DELETE',
	    url:'/eliminarUsuario/'+usr._id,//$.cookie("uid"),
	    data:'{}',
	    success:function(data){
	      if (data.resultados==1)
	      {
	        eliminarCookies();
	        mostrarLogin();
	      }
	      },
	    contentType:'application/json',
	    dataType:'json'
	  });
	}
}