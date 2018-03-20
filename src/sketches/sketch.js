export default function sketch (p) {
  let rotation = 0;
  var circles = [];
  p.setup = function () {
    var cnv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  };

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
     console.log('pressed in p5');
     p.circles();

  };

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
    
  };


};
