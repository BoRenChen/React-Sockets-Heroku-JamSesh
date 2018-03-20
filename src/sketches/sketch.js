export default function sketch (p) {
  let rotation = 0;
  var circles = [];
  p.setup = function () {
    var cnv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  };


  //Bar Player
     function Rectangle(height, tH, Color) {
      this.height = height;
      this.tH= tH;
      this.Color= Color;
  }

  Rectangle.prototype.render = function() {
    if (this.height < this.tH ) {
      this.height += 20;
    } else if (this.height > this.tH) {
      this.height -= 20;
    }
  }

function Color(r,g,b,t) {
      this.r = r; 
      this.g = g; 
      this.b = b;
      this.t = t; 
  }


    var x = 0; 
    var halfHeight = p.windowHeight/2;
    var color = new Color(128,128,128, 0);


    
  var easing = 0.05;
    var diffy = targetY - 20;
    var targetY,targetY2;
    var bb = new Color(0,0,0,0);
   
    var animate = false; 
    var y1 = new Rectangle(0, 0, color);
    console.log(y1,"y1");
    console.log(y1.height);
    var y2 = new Rectangle(0,0,   color);
    var y3 = new Rectangle(0,0,  color);
    var y4 = new Rectangle(0, 0, color);
    var y5 = new Rectangle(0,0,  color);
    var y6 = new Rectangle(0,0,  color);
    var y7 = new Rectangle(0, 0, color);
    var y8 = new Rectangle(0, 0, color);
    var y9 = new Rectangle(0, 0, color);
    var y10 = new Rectangle(0, 0, color);
    var oneTenthWW = p.windowWidth/10;
    var y = "y";
    var rectangles = [y1, y2,y3,y4,y5,y6,y6,y7,y8,y9,y10];

  

  //End Bar Player



  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    console.log(props)
    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
    if(props.circles){
      console.log(props.circles);
      circles = props.circles;
    }
  };
  p.keyPressed = function() {
     console.log(p.keyCode)
    var color1 = new Color(128,128,128, .3);
    var color2 = new Color(0,0,0,1);
    var code =  p.keyCode;
    if (code == 65 || code == 90|| code ==81) {//A
      y1.tH = -200;
    }

    if ( code == 87  ) {
      y2.Color = color2;

    }
    if (code == 83|| code == 87|| code ==88) {//S
        y2.tH = -200;
    }
    if (code == 68 || code == 69|| code ==67) {//D
        y3.tH = -200;
    }
    if (code == 70 || code == 82|| code ==86) {//F
        y4.tH = -200;
    }
    if (code == 71|| code ==84 || code ==66) {//G
        y5.tH = -200;
    }
    if (code == 72|| code ==89 || code ==78) {//H
        y6.tH = -200;
    }
    if (code == 74|| code ==85 || code ==77) {//J
        y7.tH = -200;
    }
    if (code== 75|| code ==73|| code ==188) {//K
        y8.tH = -200;
    }
    if (code == 76|| code ==79|| code ==190) {//L
        y9.tH = -200;
    }
    if (code == 186|| code == 80|| code ==191) {//S
        y10.tH = -200;
    }

  };

  p.keyReleased = function() {
    var code =  p.keyCode;

    if (code == 65 || code == 90|| code ==81) {//A
        y1.tH = 0;
    } 
    if (code == 83 || code == 87|| code ==88) {//S
        y2.tH = 0;
    } 
    if (code == 68 || code == 69|| code ==67) {//S
        y3.tH = 0;
    } 
    if (code == 70 || code == 82|| code ==86) {//S
        y4.tH = 0;
    } 
    if (code == 71 || code ==84 || code ==66) {//S
        y5.tH = 0;
    } 
    if (code == 72 || code ==89 || code ==78) {//S
        y6.tH = 0;
    } 
    if (code == 74 || code ==85 || code ==77) {//S
        y7.tH = 0;
    } 
    if (code == 75 || code ==73|| code ==188) {//S
        y8.tH = 0;
    } 
    if (code == 76 || code ==79|| code ==190) {//S
        y9.tH = 0;
    } 
    if (code == 186 || code == 80|| code ==191) {//S
        y10.tH = 0;
    }     
  }

function rectMaker(rect, xpos) {
    p.fill(rect.Color.r, rect.Color.g, rect.Color.b, rect.Color.b)
    p.rect(xpos, halfHeight, oneTenthWW, rect.height);
  }

  p.circles = function() {
      // for (let i = 0; i < 1; i++) {
      //   let circle = {
      //     x: Math.floor(Math.random() * (window.innerWidth - 80) + 60),
      //     y: Math.floor(Math.random() * (window.innerHeight - 80) + 60),
      //     diameter: Math.floor(Math.random() * 30 + 20),
      //     dx: (Math.random() - 0.5) * 4,
      //     dy: (Math.random() - 0.5) * 4
      //   };
      //   circles.push(circle);
      // }
      console.log(circles);
  };
  const changeVelocity = c => {
    if (c.x + c.diameter / 2 > window.innerWidth || c.x - c.diameter / 2 < 0) {
      c.dx = -c.dx;
    }
    if (c.y + c.diameter / 2 > window.innerHeight || c.y - c.diameter / 2 < 0) {
      c.dy = -c.dy;
    }
    c.x += c.dx;
    c.y += c.dy;
  };


  p.draw = function () {

    p.background(100);
    p.noStroke();

    p.push();
    p.translate(-window.innerWidth /2, -window.innerHeight/2);
  

    circles.forEach(c => {
      p.noStroke();
      p.fill(c.r, c.g, c.b, c.a);
      p.ellipse(c.x, c.y, c.diameter, c.diameter);

      // changeVelocity(c);
      // circles.forEach(circleTwo => {
      //   let a = Math.abs(c.x - circleTwo.x);
      //   let b = Math.abs(c.y - circleTwo.y);
      //   let distance = Math.sqrt(a * a + b * b);
      //   if (distance < 200) {
      //     p.stroke(255, 255, 255, 70);
      //     p.line(c.x, c.y, circleTwo.x, circleTwo.y);
      //   }
      });

      p.pop();
    




    y1.render();
    y2.render();
    y3.render();
    y4.render();
    y5.render();
    y6.render();
    y7.render();
    y8.render();
    y9.render();
    y10.render();

    p.noStroke();

    p.push();
    p.translate(150, 100);
    p.box(100, 100, 100);
    p.pop();

    p.noFill();
    p.noStroke();
   
    p.push();
    p.translate(500, p.height*0.35, -200);

    p.rotateY(rotation);
    p.rotateX(-0.9);
    p.box(400);
    p.pop();

    
    p.fill(128 , 128, 128);



    


    if(p.abs(y1) > 1) {
    
  }


  
   // p.rectMode(p.CENTER);

    rectMaker(y6, 0);
    rectMaker(y7, oneTenthWW);
    rectMaker(y8,oneTenthWW*2);
    rectMaker(y9,oneTenthWW*3);
    rectMaker(y10,oneTenthWW*4);

    rectMaker(y5,-oneTenthWW);
    rectMaker(y4,-oneTenthWW*2);
    rectMaker(y3,-oneTenthWW*3);
    rectMaker(y2,-oneTenthWW*4);
    rectMaker(y1,-oneTenthWW*5);

  };


};
