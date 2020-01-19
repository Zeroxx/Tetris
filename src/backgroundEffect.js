import $ from 'jquery';

export const backgroundEffect = () => {
    var $body = $('body');

    $('#effect').remove();
    $body.addClass('is-star');

    function callCanvas (canvas) {
      var screenpointSplit = 12000
      var movingSpeed = 0.2
      var viewportWidth = $(window).width();
      var viewportHeight = $(window).height();
      var nbCalculated = Math.round(viewportHeight*viewportWidth/screenpointSplit);

      var $this = $(this),
      ctx = canvas.getContext('2d');
      $this.config = {
        star: {
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1.5
        },
        line: {
          color: 'rgba(255, 255, 255, 0.2)',
          width: 0.4
        },
        position: {
          x: canvas.width * 0.5,
          y: canvas.height * 0.5
        },
        velocity: movingSpeed,
        length: nbCalculated,
        distance: 130,
        radius: 120,
        stars: []
      };

      function Star () {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = ($this.config.velocity - (Math.random() * 0.3));
        this.vy = ($this.config.velocity - (Math.random() * 0.3));

        this.radius = Math.random() * $this.config.star.width;
      }

      Star.prototype = {

        create: function(){
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          ctx.fill();
        },

        animate: function(){
          var i;
          for(i = 0; i < $this.config.length; i++){

            var star = $this.config.stars[i];

            if(star.y < 0 || star.y > canvas.height){
              star.vy = - star.vy;
            }
            else if(star.x < 0 || star.x > canvas.width){
              star.vx = - star.vx;
            }
            star.x += star.vx;
            star.y += star.vy;
          }
        },

        line: function(){
          var length = $this.config.length,
            iStar,
            jStar,
            i,
            j;

          for(i = 0; i < length; i++){
            for(j = 0; j < length; j++){
              iStar = $this.config.stars[i];
              jStar = $this.config.stars[j];

              if(
                (iStar.x - jStar.x) < $this.config.distance &&
                (iStar.y - jStar.y) < $this.config.distance &&
                (iStar.x - jStar.x) > - $this.config.distance &&
                (iStar.y - jStar.y) > - $this.config.distance
              ) {
                if(
                  (iStar.x - $this.config.position.x) < $this.config.radius &&
                  (iStar.y - $this.config.position.y) < $this.config.radius &&
                  (iStar.x - $this.config.position.x) > - $this.config.radius &&
                  (iStar.y - $this.config.position.y) > - $this.config.radius
                ) {
                  ctx.beginPath();
                  ctx.moveTo(iStar.x, iStar.y);
                  ctx.lineTo(jStar.x, jStar.y);
                  ctx.stroke();
                  ctx.closePath();
                }

              }
            }
          }
        }

      };
      $this.createStars = function () {
        var length = $this.config.length,
          star,
          i;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(i = 0; i < length; i++){
          $this.config.stars.push(new Star());
          star = $this.config.stars[i];
          star.create();
        }
        star.line();
        star.animate();
      };

      $this.setCanvas = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      $this.setContext = function () {
        ctx.fillStyle = $this.config.star.color;
        ctx.strokeStyle = $this.config.line.color;
        ctx.lineWidth = $this.config.line.width;
        ctx.fill();
      };

      $this.bind = function () {
        $(window).on('mousemove', function(e){
          $this.config.position.x = e.pageX;
          $this.config.position.y = e.pageY;
        });
      };

      $this.init = function () {
        $this.setCanvas();
        $this.setContext();
        $this.bind();
      };

      function lightItUp() {
        window.requestAnimationFrame(lightItUp);
        $this.createStars();
      }

      lightItUp();
      return $this;
    }

    var waitForFinalEvent = (function () {
      var timers = {};
      return function (callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = '';
      }
      if (timers[uniqueId]) {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
      };
    })();

    $(window).on('load', function() {
      waitForFinalEvent(function(){
        callCanvas($('canvas')[0]).init();
      }, 800, '');
    });

    $(window).resize(function () {
      waitForFinalEvent(function(){
        callCanvas($('canvas')[0]).init();
      }, 800, '');
    });
  }

