var sendgrid = require("sendgrid")("usuario","clave");

var url="https://aliensattack.herokuapp.com/";

module.exports.enviarEmail=function(direccion,key,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	//email.addBcc('conquistaniveles@gmail.com');
	email.setFrom('tu-cuenta-email');
	email.setSubject('confirmar cuenta');
	email.setHtml('<h3>Bienvenido a AliensAttack</h3><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">'+msg+'</a></p>');

	sendgrid.send(email);	
}

module.exports.enviarEmailAddor=function(direccion,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	//email.addBcc('conquistaniveles@gmail.com');
	email.setFrom('tu-cuenta-email');
	email.setSubject('Nuevo usuario en AliensAttack');
	email.setHtml('<p>'+msg+'</p>');

	sendgrid.send(email);	
}

module.exports.enviarEmailResetPassword=function(direccion,key,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	email.setFrom('tu-cuenta-email');
	email.setSubject('Reiniciar clave');
	email.setHtml('<h3>AliensAttack: recuperar clave</h3><p>'+msg+'<a href="'+url+'cambiarClave/'+direccion+'/'+key+'">enlace</a></p>');

	sendgrid.send(email);	
}