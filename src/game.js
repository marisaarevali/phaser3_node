import Phaser from 'phaser';

class gameScene extends Phaser.Scene {

  constructor() {
    super('gameScene');
  }

  create() {

    //kas mäng töötab
    this.mang = false;
    // mängukiirus
    this.manguKiirus = 10;
    //takistuste teke
    this.sunniAeg = 0;
    //mängija punktid
    this.skoor = 0;
    //mängija highscore
    this.highSkoor = 0;
    //mängu kõrgus laius
    const {height,width} = this.game.config;
    //lisame päästiku mille pihta hüpates mäng algab
    this.paastik = this.physics.add.sprite(0,height-200).setOrigin(0,1).setImmovable();
    //maapind
    this.maapind = this.add.tileSprite(0,height,width,20,'maapind').setOrigin(0,1);
    //console.log(this.maapind);
    //this.salamaa = this.physics.add.sprite(0,height,).setOrigin(0,1).setImmovable();
    
    
    
   
    
    //this.ground = this.add.tileSprite(0,height,width,26,'ground').setOrigin(0,1);
    this.tegelane = this.physics.add.sprite(0,height-50,'munaseisab')
      .setOrigin(0,1)
      //paneme mängule piirid peale, et tegelane ei saaks minna mängust välja
      .setCollideWorldBounds(true)
      //lisame gravitatsiooni Y teljel, kukub 5000 px sekundis
      .setGravityY(5000)
    
    this.physics.add.collider(this.tegelane,this.salamaa);



    //skoor tekst
    this.skooriKiri = this.add.text(width-900,0,'Skoor: 0',{fill: '#000', font: '700 24px Arial', resolution: 5}).setOrigin(1,0);
    //highcsore
    this.highSkooriKiri = this.add.text(width-900,50,'Kõrgeim skoor: 0',{fill: '#000', font: '700 24px Arial', resolution: 5})
      .setOrigin(1,0)
      .setAlpha(0); // esialgu nähtamatu kui veel mänginud ei ole

    //mang labi pilt, setAlpha on kõikidel elementidel default 1 mis on nähtav. 0 väärtus on läbipaistev
    this.mangLabi = this.add.container(width/2, height/2).setAlpha(0);
    this.mangLabiTekst = this.add.image(0,0,'manglabi');
    //setInteractive teeb selle pildi klikitavaks
    this.uuesti = this.add.image(0,120, 'uuesti').setInteractive();

    this.mangLabi.add([
      this.mangLabiTekst,
      this.uuesti
    ])


    //takistuste grupp
    this.takistused = this.physics.add.group();

    //mängu alustamine
    this.alustaMangu();
    //takistusega kokkupõrge
    this.kokkuPorge();
    //animatsioonid
    this.liikumine();
    // kasutaja input
    this.sisend();
    //skoori arvutus
    this.skooriArvutus();
  }


  kokkuPorge() {
    this.physics.add.collider(this.tegelane, this.takistused, () => {
      //peata kõik füüsika
      this.physics.pause();
      //mäng ei jookse enam
      this.mang = false;
      // kõik animatsioon pausile
      this.anims.pauseAll();
      //tegelasel valu nägu
      this.tegelane.setTexture('munakatki');
      //resetime takistuste tekkeaja
      this.sunniAeg = 0;
      //resetime mängukiiruse
      this.manguKiirus = 10;
      //muudame mängu lõputeksti nähtavaks
      this.mangLabi.setAlpha(1);
    }, null, this)

  }


  alustaMangu() {
    const {width,height} = this.game.config;
    //kui tegelane ja päästik kokku saavad, siis mäng läheb käima
    // parameetrid:
    // objekt 1 mille puhul kontrollid overlapi,objekt2 kontroll, callback peale collide, bool callback,scope
    this.physics.add.overlap(this.paastik, this.tegelane, () => {
      
      //kui päästik on oma algsel asukohal y teljel
      if (this.paastik.y === 10) {
        //anname talle uue asukoha canvase allosas
        this.paastik.body.reset(0,height);
        return;        
      }
      //disableme selle, et paastik töötaks ainult ühe korra
      this.paastik.disableBody(true,true);
      console.log('aa');
    

    const startMang = this.time.addEvent({
      delay: 1000/60,
      loop: true,
      callbackScope: this,
      callback: () => {
        this.tegelane.setVelocityX(250);
        this.tegelane.play('jooksmine', 1);

        if (this.tegelane.x > 100) {
          //see paneb update funktsiooni sisu lõpuks käima
          this.mang = true;
          //tegelane ei jookse enam edasi
          this.tegelane.setVelocity(0);

          startMang.remove();
        }

      }
    })

  }, null,this);
}


  liikumine() {
    this.anims.create( {
      key: 'jooksmine',
      frames: this.anims.generateFrameNumbers('munajookseb'),
      //10fps
      frameRate: 7,
  
    })
  }

  
  skooriArvutus() {
    this.time.addEvent({
      delay: 1000/10, //10 korda sekudis kutsutakse välja
      loop: true,
      callbackScope: this,
      //mida teeb funktsioon kui teda välja kutsutakse
      callback: () => {
        //kas mäng käib?
        if (!this.mang ) { return;} //kui ei siis return
        // mäng käib tõsta skoori 1 võrra
        this.skoor++
        // teeme mängu kiiremaks
        this.manguKiirus += 0.01;
        console.log('skoor ' + this.skoor);
        console.log('kiirus '+ this.manguKiirus);
        this.skooriKiri.setText('Skoor: ' + this.skoor);
      }



    })
  }

//mängija sisendite funktsioon
  sisend() {
    //uuesti nupule vajutuse funktsioon, muudame kõik algsesse olekusse tagasi
    this.uuesti.on('pointerdown', () => {
      // tegelane tagasi 0 punkti
      this.tegelane.setVelocityY(0);
      this.tegelane.body.height = 95;
      this.tegelane.body.offset.y = 0;
      //Resumes the simulation (if paused).
      this.physics.resume();
      //kustutab kõik takistused mängust ja grupis - default value on false,false
      this.takistused.clear(true,true);
      //nuppu vajutades mäng uuesti käima
      this.mang = true;
      //varjame jälle lõpuekraani
      this.mangLabi.setAlpha(0);
      //taasta kõik pausile pandud animatsioonid
      this.anims.resumeAll();
      //resetime mangukiiruse
      this.manguKiirus = 10;
      //vajadusel uuendame highscore
      if (this.skoor > this.highSkoor){
        this.highSkoor = this.skoor;
        this.highSkooriKiri.setText('Kõrgeim skoor: ' + this.highSkoor).setAlpha(1);
      }
       
      

      
      //resetime skoori
      this.skoor = 0;

    })
    //igakord kui vajutad tühikut siis kutsu välja funktsioon mis tõstab tegelast, -1600 sp et ta tõuseb ülespoole
    this.input.keyboard.on('keydown_SPACE', () => {
      //et mängija saaks hüpata ainult siis kui on otsene kontakt maaga
      //kui tegelane on õhus siis ära tee midagi
      if (!this.tegelane.body.onFloor()) { return;}

       //määrame tegelase tavaline pikkuse tagasi
      // this.tegelane.body.height = 95;
       //offset on null, sest pikkus on vastav
      // this.tegelane.body.offset.y = 0;
      
      this.tegelane.setVelocityY(-1800);
    })
  }

  takistuseFunk() {
    const { width, height } = this.game.config;
    //random suvaline arv 1-6
    const takistuseNumber =  Math.floor(Math.random() * 5) + 1;
    const vahemaa = Phaser.Math.Between(500,1200);
    let takistus;
    // siin lisame takistuse sprite lõppu random numbri
    // siin on takistuse pilti ümber backtick, kui seda klaviatuuril ei ole siis alt+9+6, `obsticle-${takistuseNumber}`
    takistus = this.takistused.create(width + vahemaa, height, `takistus${takistuseNumber}`);
    //kui offseti ei määra, siis on taskistuste body liikumise ajal natuke paigast ära?????? ikka on
    takistus.body.offset.y = +10;

    takistus
      .setOrigin(0,1)
      .setImmovable();


    //console.log(takistus);
    // console.log(vahemaa);

  }

//60 fps
  update(time, delta) {
    //kui mäng ei käi siis ära liigu edasi
    if (!this.mang) { return;  }

    //game.physics.arcade.collide(this.tegelane, this.maapind);
    
    //this.salamaa.addChild(game.make.sprite(delta, height));    
  

    

  
    // paneme maapinna liikuma
    this.maapind.tilePositionX += this.manguKiirus;

    //this.maapind.setVelocityX += 5;
    //suurendame takistuste asukohta mangujooksul
    Phaser.Actions.IncX(this.takistused.getChildren(), -this.manguKiirus);
    //console.log(delta);
    //console.log(this.manguKiirus)
    //paneme aja jooksma
    this.sunniAeg += delta * this.manguKiirus * 0.08;
    //console.log(this.sunniAeg);
    //kui aeg on suurem kui 1500 siis tuleb takistus ja nulli aeg
    if (this.sunniAeg >= 1500) {
      this.takistuseFunk();
      this.sunniAeg = 0;
    }
    // kustutame mängust välja läinud takistused ära'
    this.takistused.getChildren().forEach(takistus => {
      if (takistus.getBounds().right < 0) {
        console.log('takistuse destroy');
        takistus.destroy();
      }
    })


    //kui tegelanse y väärtus on suurem kui 0, peata muud animatsioonid ja pane ta paigale (sest ta on õhus)
    if (this.tegelane.body.deltaAbsY() > 0) {
      this.tegelane.anims.stop();
      this.tegelane.setTexture('munajookseb')
    // ja kui ta on vastu maad ehk jookseb
    } else {
      //kasutame ternary operatorit - tingimus ? väljund mida teha kui tingimus on true : väljund mida teha kui tingimus on false
      // Kui tegelase keha on lyhem kui 58px? pane kükitav animatsioon : kui ei siis pane tavaline anim
      this.tegelane.play('jooksmine', true);

    }
  }
}

export default gameScene;
