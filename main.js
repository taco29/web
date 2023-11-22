 // ===================== start =======================
 // animation start after 1000 miliseconds
 setTimeout(init, 1000);

 var odrag = document.getElementById('drag-container');
 var ospin = document.getElementById('spin-container');
 var aImg = ospin.getElementsByTagName('img');
 var aVid = ospin.getElementsByTagName('video');
 var aEle = [...aImg, ...aVid]; // combine 2 arrays

 // Size of images
 ospin.style.width = imgWidth + "px";
 ospin.style.height = imgHeight + "px";

 // Size of ground - depend on radius
 var ground = document.getElementById('ground');
 ground.style.width = radius * 3 + "px";
 ground.style.height = radius * 3 + "px";

 function init(delayTime) {
     for (var i = 0; i < aEle.length; i++) {
         aEle[i].style.transform = "rotateY(" + i * (360 / aEle.length) + "deg) translateZ(" + radius + "px)";
         aEle[i].style.transition = "transform 1s";
         aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
     }
 }

 function applyTranform(obj) {
     // Constrain the angle of camera (between 0 and 180)
     if (tY > 180) tY = 180;
     if (tY < 0) tY = 0;

     // Apply the angle
     obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
 }

 function playSpin(yes) {
     ospin.style.animationPlayState = yes ? 'running' : 'paused';
 }

 var sX, sY, nX, nY, desX = 0,
     desY = 0,
     tX = 0,
     tY = 10;

 // auto spin
 if (autoRotate) {
     var animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
     ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
 }

 document.getElementById('music-container').innerHTML += `
 <a target="_blank" href="https://taoanhdep.com/tao-website-album-anh-3d/" style=" background: transparent; border: 0; margin: 15px; position: fixed; right: 0; cursor: pointer; "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style=" width: 20px; height: 20px; fill: #333; "><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg></a>
  `;

 // add background music
 if (bgMusicURL) {
     document.getElementById('music-container').innerHTML += `
  <audio id="audioPlayer" src="${bgMusicURL}" ${bgMusicControls ? 'controls' : ''} autoplay="" loop="">    
  </audio>
  <button id="playButton"> <span class="play-icon">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>️</span>
  <span class="pause-icon" style="display:none;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
  </span> </button>
  `;


     var audio = document.getElementById('audioPlayer');
     var playButton = document.getElementById('playButton');
     var playIcon = playButton.querySelector('.play-icon');
     var pauseIcon = playButton.querySelector('.pause-icon');

     playButton.addEventListener('click', function() {
         if (audio.paused) {
             audio.play();
         } else {
             audio.pause();
         }
     });


     audio.addEventListener('play', function() {
         playIcon.style.display = 'none';
         pauseIcon.style.display = 'inline-block';
     });

     audio.addEventListener('pause', function() {
         playIcon.style.display = 'inline-block';
         pauseIcon.style.display = 'none';
     });

 }


 // setup events
 document.onpointerdown = function(e) {
     clearInterval(odrag.timer);
     e = e || window.event;
     var sX = e.clientX,
         sY = e.clientY;

     this.onpointermove = function(e) {
         e = e || window.event;
         var nX = e.clientX,
             nY = e.clientY;
         desX = nX - sX;
         desY = nY - sY;
         tX += desX * 0.1;
         tY += desY * 0.1;
         applyTranform(odrag);
         sX = nX;
         sY = nY;
     };

     this.onpointerup = function(e) {
         odrag.timer = setInterval(function() {
             desX *= 0.95;
             desY *= 0.95;
             tX += desX * 0.1;
             tY += desY * 0.1;
             applyTranform(odrag);
             playSpin(false);
             if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                 clearInterval(odrag.timer);
                 playSpin(true);
             }
         }, 17);
         this.onpointermove = this.onpointerup = null;
     };

     return false;
 };

 document.onmousewheel = function(e) {
     e = e || window.event;
     var d = e.wheelDelta / 20 || -e.detail;
     radius += d;
     init(1);
 };
 //# sourceURL=pen.js