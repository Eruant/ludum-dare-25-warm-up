/*
  Fire
  --------------------------------------------
  Matt Gale (matt@littleball.co.uk)
  Created for the Ludum Dare 25 warm up
*/

window.raf = (function() {
  return  window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(/* function */ callback, /* DOMElement */ element){
      window.setTimeout(callback, 1000 / 60);
    }
  ;
})();

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function Fire() {
  
  // --- global values ---
  var canvas = document.createElement('canvas')
    , color = {
      smoke: 'rgba(0,0,0,0.5)'
    }
    , gravity = 0.08
    , wind = (Math.random()-0.4) / 20
    , ctx = canvas.getContext('2d')
    , canvasHeight = (function(){
        return (typeof(window.innerHeight) == 'number') ? window.innerHeight : document.documentElement.clientHeight;
      })()
    , canvasWidth = (function(){
        return (typeof(window.innerWidth) == 'number') ? window.innerWidth : document.documentElement.clientWidth;
      })()
    , xFirePosition = canvasWidth / 4
    , yFirePosition = canvasHeight

    // draw the game board (also acts a clear screen)
    , ash = new function(t) {
        var particles = []
          , maxCount = 100
          , ashImg1 = new Image()
          , ashImg2 = new Image()
          , addParticle = function(){
            particles.push({
                x: xFirePosition + (Math.random()*5-2.5)
              , y: yFirePosition
              , xSpeed: (Math.random > 0.9) ? Math.random()*20-10 : Math.random()*2-1
              , ySpeed: Math.random()*5-8
              , rotation: 0
              , rotationSpeed: Math.random()*0.2-0.1
              , size: Math.random()*5
              , maxSpeed: 1.2
              , img : (Math.random > 0.6) ? ashImg1 : ashImg2
            });
          }
        ;

        ashImg1.src = 'ash1.png';
        ashImg2.src = 'ash2.png';

        // draw the board onto the canvas
        this.draw = function() {
          var i;

          if(particles.length < maxCount) {
            addParticle(); 
          }

          for(i=0; i<particles.length; i++) {
            // rotate the canvas
            ctx.save();
            ctx.translate(particles[i].x, particles[i].y);
            ctx.rotate(particles[i].rotation);

            ctx.beginPath();
            ctx.fillStyle = color.smoke;
            ctx.drawImage(particles[i].img,0,0,particles[i].size,particles[i].size);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            if(particles[i].ySpeed < particles[i].maxSpeed) {
              particles[i].ySpeed += gravity;
            }
            particles[i].xSpeed += wind;

            particles[i].x += particles[i].xSpeed;
            particles[i].y += particles[i].ySpeed;
            particles[i].rotation += particles[i].rotationSpeed;

            if(particles[i].x < 0 || particles[i].x > canvasWidth || particles[i].y > canvasHeight) {
              particles.remove(i);
            }
          }
        };

      }(this)
    , stars = new function(t) {
        var stars = []
          , addStar = function() {
              stars.push({
                  x: Math.random()*canvasWidth
                , y: Math.random()*(canvasHeight-100)
                , size: Math.random() * 2
              })
            }
          , maxStars = 50
          , i
        ;

        for(i=0; i<maxStars; i++) { addStar(); }

        this.draw = function() {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(canvasWidth - 200, 100, 30, 0, 360, false);
          ctx.closePath();
          ctx.fill();

          var i;
          for(i in stars) {
            ctx.beginPath();
            ctx.arc(stars[i].x, stars[i].y, stars[i].size, 0, 360, false);
            ctx.closePath();
            ctx.fill();
          }
        };

      }(this)
    , fire = new function(t) {
        var particles = []
          , addParticle = function(){
            particles.push({
                x: xFirePosition + (Math.random()*10-5)
              , y: yFirePosition - 5
              , xSpeed: Math.random()*6-3
              , ySpeed: Math.random()*2-2.5
              , rotation: 0
              , rotationSpeed: Math.random()*0.2-0.1
              , size: Math.random()*4
              , color: (Math.random()>0.5 ? 'rgba(200, 100, 0, 0.5)' : 'rgba(250, 60, 0, 0.8)')
            });
          }
        ;

        this.draw = function() {
          var i;

          for(i=0; i<5; i++ ) {
            addParticle();
          }

          for(i=0; i<particles.length; i++) {
            var size = particles[i].size;

            ctx.save();
            ctx.translate(particles[i].x, particles[i].y);
            ctx.rotate(particles[i].rotation);
            ctx.scale(0.6,1);

            ctx.beginPath();
            ctx.fillStyle = particles[i].color;
            ctx.arc(0,0,size,0,360,false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            particles[i].xSpeed += ((particles[i].x > xFirePosition) ? -0.5 : 0.5) + wind;

            particles[i].x += particles[i].xSpeed;
            particles[i].y += particles[i].ySpeed;
            particles[i].rotation += particles[i].rotationSpeed;
            particles[i].size -= 0.2;

            if(particles[i].size < 0.1) {
              particles.remove(i);
            }


          }

        };

      }(this)

    , logs = new function(t) {
        this.draw = function() {
          ctx.save();
          ctx.fillStyle = '#210';
          ctx.beginPath();
          ctx.moveTo(xFirePosition,yFirePosition);
          ctx.lineTo(xFirePosition-12,yFirePosition);
          ctx.lineTo(xFirePosition-12,yFirePosition-3);
          ctx.lineTo(xFirePosition-6,yFirePosition-3);
          ctx.lineTo(xFirePosition-10,yFirePosition-4);
          ctx.lineTo(xFirePosition-3,yFirePosition-2);
          ctx.lineTo(xFirePosition-4,yFirePosition-5);
          ctx.lineTo(xFirePosition-1,yFirePosition-5);
          ctx.lineTo(xFirePosition-1,yFirePosition);
          ctx.lineTo(xFirePosition+4,yFirePosition-7);
          ctx.lineTo(xFirePosition+5,yFirePosition-7);
          ctx.lineTo(xFirePosition+1,yFirePosition-1);
          ctx.lineTo(xFirePosition+10,yFirePosition-6);
          ctx.lineTo(xFirePosition+10,yFirePosition-4);
          ctx.lineTo(xFirePosition+3,yFirePosition-2);
          ctx.lineTo(xFirePosition+12,yFirePosition-4);
          ctx.lineTo(xFirePosition+12,yFirePosition);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }(this)
    
    , debug = new function(t) {
        this.draw = function() {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Monaco, Courier, Arial';
          ctx.fillText('Wind: '+Math.floor(wind*1000)/1000, 10, 10);
        };
      }(this)

    // update the canvas whenever the browser is ready
    , update = function() {
        canvas.height = canvasHeight; // clears the screen
        stars.draw();
        ash.draw();
        fire.draw();
        logs.draw();
        debug.draw();
        wind += (Math.random() - 0.5) / 1000;
        raf(update);
      }
  ;

  canvas.height = canvasHeight;
  canvas.width = canvasWidth;

  // add canvas to the end of the page
  document.getElementsByTagName('body')[0].appendChild(canvas);
  
  // translate the drawing so that we can draw on pixel rather than in between
  ctx.translate(0.5,0.5);
  raf(update);

}

window.onload = function() {
  var f = new Fire();
};