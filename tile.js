const container = document.getElementById('videoContainer');
const trigger = document.getElementById ('landingPage')
    const startBtn = document.getElementById('startBtn');
    let interval;
    let tileCount = 0;

    function createVideoTile() {
      const video = document.createElement('video');
      video.className = 'video-tile';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      video.src = './play-bloc.mp4';
      
      return video;
    }

    function addTwoVideos() {
      if (tileCount >= 16) { 
        clearInterval(interval);
        return;
      }

      for (let i = 0; i < 2; i++) {
        const video = createVideoTile();
        container.appendChild(video);
        void video.offsetWidth;
        setTimeout(() => {
            video.classList.add('visible');
          }, 100);
        
        tileCount++;
      }
      
      const columns = Math.ceil(Math.sqrt(tileCount));
      container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }

    function reset() {
      clearInterval(interval);
      container.innerHTML = '';
      tileCount = 0;
      tileCountDisplay.textContent = '0';
    }


    trigger.addEventListener("mouseover", () => {
      clearInterval(interval);
      interval = setInterval(addTwoVideos, 1000);
    });
