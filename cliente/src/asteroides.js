
function Boot(){
    this.create=function(){
        cliente.cargarConfiguracion(game.width-20,game.height-20);
    }
}

function Juego(){
    this.naves={};
    this.cursors;
    this.veggies;
    this.naveLocal;
    this.fin=false;
    this.marcador;
    this.rival;
    this.text;
    this.coord;
    this.alienX;
    this.alienY;
    this.duration;
    this.bajada;
    this.balas;
    this.enemyBullet;
    this.enemyBullets;
    this.aliens;
    this.firingTimer=0;
    this.firingLapse=2000;
    this.estrellas;
    this.explosions;
    this.getPuntos;

    this.preload=function() {
       game.load.image('space', 'cliente/recursos/deep-space.jpg');
       game.load.image('bullet', 'cliente/recursos/bullets.png');
       game.load.image('ship', 'cliente/recursos/ship.png');
       game.load.image('estrella', 'cliente/recursos/estrella.png');
       game.load.image('enemyBullet', 'cliente/recursos/enemy-bullet.png');
       game.load.spritesheet('invader', 'cliente/recursos/bichos32x32x4.png', 32, 32);       
       game.load.spritesheet('kaboom', 'cliente/recursos/explode.png', 128, 128);
       game.load.spritesheet('puntos', 'cliente/recursos/puntos.png', 48, 48);
       //game.load.spritesheet('veggies', 'cliente/recursos/fruitnveg32wh37.png', 32, 32);
       //game.load.spritesheet('veggies', 'cliente/recursos/pokemon.png', 96, 96);
       game.load.bitmapFont('carrier_command', 'cliente/recursos/carrier_command.png', 'cliente/recursos/carrier_command.xml');
       game.load.image("play","cliente/recursos/reset.png");
    }
    this.init=function(data){
        game.stage.disableVisibilityChange = true;
        this.coord=data;
        this.alienX=data.alienX;
        this.alienY=data.alienY;
        this.duration=data.duration;
        this.bajada=data.bajada;
        this.balas=data.balas;
        this.firingLapse=data.lapse;
    }

    this.create=function() {

        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;

        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        
        this.marcador = game.add.text(game.world.centerX, 20, "Partida: "+cliente.room, {
                font: "20px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        this.marcador.anchor.setTo(0.5, 0.5);      

        this.text = game.add.text(game.world.centerX, 300, "AliensAttack", {
                font: "90px Arial Black",
                fill: "#FDFEFE",
                align: "center"
            });
        
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;  

        game.input.onDown.addOnce(this.eliminarTexto, this);        

        // this.veggies = game.add.physicsGroup();        

        // for(var i=0;i<this.coord.length;i++){
        //     var c = this.veggies.create(this.coord[i].x, this.coord[i].y, 'veggies', this.coord[i].veg);
        // }

        // The enemy's bullets
        this.enemyBullets = game.add.group();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyBullets.createMultiple(30, 'enemyBullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 1);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('checkWorldBounds', true);

        //  The baddies!
        this.aliens = game.add.group();
        this.aliens.enableBody = true;
        this.aliens.physicsBodyType = Phaser.Physics.ARCADE;

        this.createAliens();

         //  An explosion pool
        this.explosions = game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(this.setupInvader, this);

        this.estrellas = game.add.group();

        //  We will enable physics for any meteorito that is created in this group
        this.estrellas.enableBody = true;
        this.estrellas.physicsBodyType = Phaser.Physics.ARCADE;

        this.getPuntos = game.add.group();
        this.getPuntos.createMultiple(30, 'puntos');
        this.getPuntos.forEach(this.setupEstrella, this);

        //  Here we'll create 12 of them evenly spaced apart
        
        this.lanzarEstrella(50);

        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        //game.input.addPointer();
        game.world.bringToTop(this.text);
        cliente.askNewPlayer();
    }
    this.setupEstrella=function(estrella){        
        estrella.anchor.x = 0.5;
        estrella.anchor.y = 0.5;
        estrella.animations.add('puntos');
    }
    this.setupInvader=function(invader){        
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    }
    this.lanzarEstrella=function(gravedad){
            
                var i=Math.floor((Math.random()*game.width)+1);
                //  Create a meteorito inside of the 'meteoritos' group
                var meteorito = this.estrellas.create(i, 5, 'estrella'); //i*70,0

                //  Let gravity do its thing
                meteorito.body.gravity.y = gravedad;
                meteorito.anchor.setTo(0.5,0.5);

                //  This just gives each meteorito a slightly random bounce value
                //meteorito.body.bounce.y = 0.7 + Math.random() * 0.2;
                meteorito.checkWorldBounds = true;
        }
    this.createAliens=function(){
         //  The baddies!
        this.aliens = game.add.group();
        this.aliens.enableBody = true;
        this.aliens.physicsBodyType = Phaser.Physics.ARCADE;
        for (var y = 0; y < this.alienY; y++)
        {
            for (var x = 0; x < this.alienX; x++)
            {
                var alien = this.aliens.create(x * 48, y * 50, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }

        this.aliens.x = 20;
        this.aliens.y = 70;

        // //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        // var tween = game.add.tween(this.aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        // //  When the tween loops it calls descend
        // tween.onRepeat.add(function(){
        //     this.aliens.y +=10;   
        // }, this);
    }
    this.randomInt=function(low, high){
        return Math.floor(Math.random() * (high - low) + low);
    }

    this.moverAliensRandom=function(bajada){
         //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        //var irA=this.randomInt(10,game.width-this.alienX*48);
        //var tween = game.add.tween(this.aliens).to( { x: irA}, this.duration, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        var tween;
        for(var i=0;i<this.aliens;i++){
            var irA=this.randomInt(10,game.width-this.alienX*48);
            tween.push(game.add.tween(this.aliens.children[i]).to( { x: irA}, this.duration, Phaser.Easing.Linear.None, true, 0, -1, true));            

            //  When the tween loops it calls descend
            tween[i].onRepeat.add(function(){
                this.y +=bajada;   
                
            }, this);
        }
        
    }

    this.moverAliens=function(bajada){
         //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(this.aliens).to( { x: game.width-this.alienX*48 }, this.duration, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //  When the tween loops it calls descend
        tween.onRepeat.add(function(){
            this.aliens.y +=bajada;   
            this.lanzarEstrella(60);
        }, this);
    }

    this.eliminarTexto=function(){
        this.text.destroy();
    }
    this.actualizarMarcador=function(){
        var cadena="Marcador: ";
        //var ju=this;
        for(var jug in this.naves){
                cadena=cadena+"Nivel: "+this.naves[jug].nivel+" Puntos: "+this.naves[jug].puntos+" Vidas: "+this.naves[jug].sprite.vidas;
            };
        this.marcador.setText(cadena);//"Partida: "+cliente.room+" | Yo:" +this.naveLocal.puntos +" Vidas: "+ this.naveLocal.sprite.vidas + "- Rival:"+this.rival.puntos);
        game.world.bringToTop(this.marcador);
    }
    // this.collisionHandler=function(bullet, veg) {
    //     //bullet.kill();
    //     if (veg.frame==this.naves[cliente.id].veg){
    //             console.log("colision");
    //             veg.kill();
    //             this.naves[cliente.id].puntos++;                
    //             //return true;
    //     }        
    // }
    this.quitarBicho=function(ind){
        var c=this.aliens.children[ind];
        c.kill();
    }
   this.collisionHandler=function(bullet, alien) {

        //this.naveLocal.puntos++;
        var ind=this.aliens.getIndex(alien);
        cliente.enviarMatarBicho(ind);
        //cliente.enviarPuntos(this.naveLocal.puntos);
        //  When a bullet hits an alien we kill them both
        bullet.kill();
        alien.kill();
        this.actualizarMarcador();
        //  Increase the score
        // score += 20;
        // scoreText.text = scoreString + score;

        //  And create an explosion :)
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
    }
    this.naveEstrella=function(sprite,estrella){
        this.naveLocal.puntos++;
        cliente.enviarPuntos(this.naveLocal.puntos);
        estrella.kill();
        this.actualizarMarcador();
        var explosion = this.getPuntos.getFirstExists(false);
        explosion.reset(sprite.body.x, sprite.body.y);
        explosion.play('puntos', 30, false, true);
    }
    this.alienSprite=function(alien,sprite){
        sprite.kill();
        cliente.enviarVidas(0);
    }
    this.enemyHitsLocal=function(player,bullet) {
        bullet.kill();        
        // live = lives.getFirstAlive();

        // if (live)
        // {
        //     live.kill();
        // }

        //  And create an explosion :)
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
        player.vidas=player.vidas-1;
        cliente.enviarVidas(player.vidas);
        this.actualizarMarcador();
        // When the player dies
        if (player.vidas< 1)
        {
            player.kill();
            this.enemyBullets.callAll('kill');

            // stateText.text=" GAME OVER \n Click to restart";
            // stateText.visible = true;

            // //the "click to restart" handler
            // game.input.onTap.addOnce(restart,this);
            //this.finJuego(cliente.id);
        }

    }

    this.enemyHitsRival=function(player,bullet) {
        bullet.kill();
        // live = lives.getFirstAlive();

        // if (live)
        // {
        //     live.kill();
        // }

        //  And create an explosion :)
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
        player.vidas=player.vidas-1;
        // When the player dies
        if (player.vidas< 1)
        {
            player.kill();
            this.enemyBullets.callAll('kill');

            // stateText.text=" GAME OVER \n Click to restart";
            // stateText.visible = true;

            // //the "click to restart" handler
            // game.input.onTap.addOnce(restart,this);
            //this.finJuego(cliente.id);
        }

    }

    this.enemyFires=function() {
        var livingEnemies = [];
        //  Grab the first bullet we can from the pool
        this.enemyBullet = this.enemyBullets.getFirstExists(false);

        livingEnemies.length=0;

        this.aliens.forEachAlive(function(alien){

            // put every living enemy in an array
            livingEnemies.push(alien);
        });


        if (this.enemyBullet && livingEnemies.length > 0)
        {
            
            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            this.enemyBullet.reset(shooter.body.x, shooter.body.y);

            game.physics.arcade.moveToObject(this.enemyBullet,this.naveLocal.sprite,120);
            this.firingTimer = game.time.now + this.firingLapse;
        }

    }
   this.rivalHandler=function(bullet, veg) {      
        if (veg.frame==this.rival.veg){
            console.log("colision rival");
            veg.kill(); 
        }  
    }
    this.processHandler=function(player, veg) {        
        return true;
    }
    this.finJuego=function(id){
        this.fin=true;
        console.log(id);
        game.state.start("FinJuego",true,false,id,this.naveLocal.nivel,this.naveLocal.puntos);
    }

    this.faltaUno=function(){
        this.marcador.setText("Partida: "+cliente.room+" | Yo:0 - Rival:0 \n --- Esperando rival ---");
        this.marcador.anchor.setTo(0.5, 0);
        game.world.bringToTop(this.marcador);
    }
    this.update=function() {

        // var id=$.cookie("usr");
        //var nave;
        // nave=this.naves[id];   
        if (!this.fin)
        {  
            var nave=this.naveLocal;
            if (nave && nave.sprite.body){
                game.physics.arcade.overlap(nave.bullets, this.aliens, this.collisionHandler, null, this);
                game.physics.arcade.overlap(this.enemyBullets, nave.sprite, this.enemyHitsLocal, null, this);
                game.physics.arcade.overlap(this.aliens,nave.sprite,this.alienSprite,null,this);
                game.physics.arcade.overlap(nave.sprite, this.estrellas, this.naveEstrella, null, this);
                // if (cliente.num>1){
                //     game.physics.arcade.overlap(this.enemyBullets, this.rival.sprite, this.enemyHitsRival, null, this);
                // }
                // if (game.physics.arcade.collide(nave.sprite, this.veggies, this.collisionHandler,this.processHandler, this))
                // {
                //     console.log('boom');                    
                // }
                // if (game.physics.arcade.collide(this.rival.sprite, this.veggies, this.collisionHandler,this.rivalHandler, this))
                // {
                //     console.log('boom');                    
                // }

                //game.physics.arcade.overlap(nave, this.veggies, this.collisionHandler, null, this);

                if (this.aliens.y+40>=nave.sprite.y){
                    cliente.enviarVidas(0);
                }        

                // if (game.input.pointer1.isDown){
                //     var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.activePointer.x, game.input.activePointer.y);  nave.sprite.rotation = targetAngle;
                //     this.moverNave(id,game.input.pointer1.x,game.input.pointer1.y,nave.sprite.body.angularVelocity);   
                // }

                 // if (this.cursors.up.isDown)
                 // {
                 //     game.physics.arcade.accelerationFromRotation(nave.sprite.rotation, 200, nave.sprite.body.acceleration);

                 // }
                 // else
                 // {
                 //     nave.sprite.body.acceleration.set(0);
                 // }
                
                if (game.input.activePointer.isDown){
                     //var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.activePointer.x, game.input.activePointer.y);  
                     //nave.sprite.rotation = targetAngle;
                     //var dif =game.input.activePointer.x<nave.sprite.body.x;
                     nave.mover(game.input.activePointer.x);//nave.sprite.body.angularVelocity);            
                }

                if (this.cursors.left.isDown)
                {
                    nave.sprite.body.velocity.x = -nave.velocidad;
                }
                else if (this.cursors.right.isDown)
                {
                    nave.sprite.body.velocity.x = nave.velocidad;
                }
                else{
                    nave.sprite.body.velocity.x=0;
                }

                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
                {
                    nave.disparar();
                }                

               //this.screenWrap(nave.sprite);
               if (game.time.now > this.firingTimer)
                {
                   this.enemyFires();
                }
                
                //nave.bullets.forEachExists(this.screenWrap, this);    
            }
            else
                this.faltaUno();
        }
    }

    this.agregarJugador = function(data){
        console.log("nuevo usuario");
        if (this.naves[data.id]==null){
            var nave=new Nave(data);
            this.naves[data.id]=nave;
            if (data.id==cliente.id){
                this.naveLocal=this.naves[cliente.id];
            }
            else{
                this.rival=nave;
            }
        }
        else{
            this.naves[data.id].ini(this.balas,data.vidas);
            this.naves[data.id].nivel=data.nivel;
            this.naves[data.id].velocidad=data.velocidad;
            this.naves[data.id].puntos=data.puntos;
        }
    }
    this.puntos=function(data){
        var nave=this.naves[data.id];
        nave.puntos=data.puntos;
        this.actualizarMarcador();
    }    
    this.vidas=function(data){
        var nave=this.naves[data.id];
        nave.vidas=data.vidas;
        //nave.sprite.vidas=data.vidas;
        this.actualizarMarcador();
    }
    this.moverNave=function(data){        
        var nave=this.naves[data.id];
        //nave.puntos=data.puntos;
        nave.mover(data.x,true);        
        this.rival=nave;
        this.actualizarMarcador();
    }
    this.volverAJugar=function(data){
        //cliente.reset();
        this.fin=false;
        //this.naves={};
        //this.naveLocal.puntos=0;
        //this.coord=[];
        game.state.start("Game",true,false,data);
    }

    this.screenWrap=function(sprite) {
       
        if (sprite.x < 0)
        {
            sprite.x =game.width;
        }
        else if (sprite.x >game.width)
        {
            sprite.x = 0;
        }

        if (sprite.y < 0)
        {
            sprite.y =game.height;
        }
        else if (sprite.y >game.height)
        {
            sprite.y = 0;
        }

    }

    this.render=function() {
        // if (this.fin){
        //     game.state.start("FinJuego",true,false,cliente.id);
        // }
    }
}


function FinJuego(){
    this.ganador;
    this.idLocal;
    this.nivel;
    this.puntos;
    this.init =function(id,nivel,puntos) {    
        //alert("Ganador: "+score)
        this.ganador=id;
        this.nivel=nivel;
        this.puntos=puntos;
    };
    this.create= function(){
        //var gameOverTitle = game.add.sprite(160,160,"gameover");
        //gameOverTitle.anchor.setTo(0.5,0.5);
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        var cadena="";
        
        if (this.ganador!="-1"){
            cadena="Enhorabuena, ¡NIVEL CONSEGUIDO!";
        }
        else{
            cadena="Lo siento, has perdido la partida"
        }

        var text2 = game.add.text(game.world.centerX, 160, cadena, {
                font: "25px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        text2.anchor.setTo(0.5, 0.5); 

       var text1 = game.add.text(game.world.centerX, 200, "Consigue la mejor marca en AliensAttack", {
                font: "25px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        text1.anchor.setTo(0.5, 0.5);    

        var text = game.add.bitmapText(game.world.centerX, 260, 'carrier_command', 'NIVEL: '+this.nivel, 64);
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;

        var playButton = game.add.button(game.world.centerX,350,"play",this.volverAJugar,this);
        playButton.anchor.setTo(0.5,0.5);
        com.comunicarNivelCompletado(this.nivel,this.puntos);
    };
    this.volverAJugar= function(){
        cliente.volverAJugar();
    }
}

function Nave(data){
    this.id=data.id;
    this.x=data.x;
    this.y=data.y;
    this.nivel=data.nivel;
    this.vidas=data.vidas;
    this.puntos=0;
    this.sprite;
    this.bullets;
    this.bullet;
    this.bulletTime = 0;
    this.velocidad=data.velocidad;
    this.mover=function(x,socket){       
       //this.sprite.rotation=ang; 
       if (this.sprite.body){
            this.sprite.body.velocity=this.velocidad;     
            //var targetAngle = game.math.angleBetween(this.sprite.x, this.sprite.y,x,y);  this.sprite.rotation = targetAngle;
            //game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 100, this.sprite.body.acceleration);
            var y=this.sprite.y;
            var distance=Phaser.Math.distance(this.sprite.x, this.sprite.y, x, this.sprite.y);
            if (distance<5){
                return;
            }
            var duration = distance*3;
            var tween = game.add.tween(this.sprite);        
            tween.to({x:x,y:y}, duration);
            tween.start();
            if (!socket)
                tween.onComplete.add(this.onComplete, this);
        }
    }
    this.onComplete=function(){
        cliente.enviarPosicion(this.sprite.x,this.sprite.y,this.sprite.rotation, this.puntos,this.sprite.vidas);
    }
    this.disparar=function() {

        if (game.time.now > this.bulletTime)
        {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
               this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
               this.bullet.lifespan = 2000;
               this.bullet.rotation = this.sprite.rotation;
               game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
               this.bulletTime =game.time.now + 50;
            }
        }
    }
    this.onDown=function(){
        this.disparar();
    }
    this.ini=function(balas,vidas){
        this.bullets= game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        this.bullets.createMultiple(balas, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        //  Our player ship
        this.sprite = game.add.sprite(this.x, this.y, 'ship');
        this.sprite.anchor.set(0.5);

        //  and its physics settings
        game.physics.arcade.enable(this.sprite);//, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(50);
        //this.sprite.body.maxVelocity.set(200);            
        this.sprite.nave=this;
        this.sprite.vidas=vidas;
        this.sprite.angle=-90;
        this.sprite.inputEnabled=true;
        this.sprite.events.onInputDown.add(this.onDown, this);
        console.log('velocidad: '+this.velocidad);
    }
    this.ini(10,this.vidas);
}