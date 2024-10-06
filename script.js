
// HAMBURGER MENU
const navbarMobile = document.querySelector('.navbar__mobile');
const hamburgerMenu = document.querySelector('i.fa-bars');

hamburgerMenu.addEventListener('click', toggleMenu);

function toggleMenu() {
  navbarMobile.classList.toggle('active');
  if(hamburgerMenu.classList.contains('fa-bars')) {
    hamburgerMenu.classList.replace('fa-bars', 'fa-times');
  } else {
    hamburgerMenu.classList.replace('fa-times', 'fa-bars');
  } 
}

// ACTIVE NAV
const navLinks = document.querySelectorAll('nav ul li a');

navLinks.forEach((navLink) => {
  navLink.addEventListener('click', () => {
     navLinks.forEach((navLink) => {
      navLink.classList.remove('active');
     })
     navLink.classList.add('active');
  })
});


// STICKY NAV
const navBar = document.querySelector('.navbar');
const navElems = document.querySelector('nav ul');
const scrollTrigger = document.createElement('div');
const labelLogos = document.querySelector('.label-logos');
const mixtapeSection = document.querySelector('.mixtape-section');
const remixSection = document.querySelector('.remix-section');
const discographySection = document.querySelector('.discography-section');
const bodyElem = document.body;

scrollTrigger.setAttribute('data-scroll-trigger', '');
labelLogos.before(scrollTrigger);

navObserver = new IntersectionObserver((entries) => {
   navBar.classList.toggle('fixed', !entries[0].isIntersecting);
   navElems.classList.toggle('d-flex', !entries[0].isIntersecting);
   labelLogos.classList.toggle('fixed', !entries[0].isIntersecting);
   mixtapeSection.classList.toggle('add-top-spacing', !entries[0].isIntersecting);
   remixSection.classList.toggle('add-top-spacing', !entries[0].isIntersecting);
   discographySection.classList.toggle('add-top-spacing', !entries[0].isIntersecting);
});

navObserver.observe(scrollTrigger);


// CLICK ACTIVE TAB
const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => {
   tab.addEventListener("click", function(e) {
    document.querySelector('.active').classList.remove('active');
     this.classList.add('active');
   });
});


// MIXTAPE COMPONENT
const mixtape = document.querySelector("#mixtape");
const playBtn = document.querySelector("#playBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const mixtapePlaylistContainer = document.querySelector(".mixtape__playlist-container");
const accordion = document.querySelector(".tape-accordion");
const accordionTitles = document.querySelectorAll(".accordion__title");
const accordionLinks = document.querySelectorAll(".accordion__links a");
let tapeGenre = document.querySelector(".mixtape__genre");
let tapeCover = document.querySelector(".mixtape__cover");
let tapeTitle = document.querySelector(".mixtape__title");
let playLink = "";
let downloadLink = "";

//FUNCTIONS

const mixtapeToHTML = (mixtape) => `
  <div class="mixtape__media">
    <img class="mixtape__cover" src="${mixtape.cover}" alt="${
  mixtape.title
} Tape Cover">
      </div>
      <div class="mixtape__content">
        <p class="mixtape__genre">${mixtape.genre}</p>
        <h2 class="mixtape__title">${mixtape.title}</h2>
        <div class="mixtape__playlist-container">
          <ol class="mixtape__playlist">${mixtape.playlist
            .map((trk) => {
              return `<li>${trk}</li>`;
            })
            .join("")}
          </ol>
        </div>
        <div class="mixtape__btns">
          <a href="${
            mixtape.playlink
          }" class="btn" id="playBtn" target="blank"><i class="fas fa-play"></i>play</a>
          <a href="${
            mixtape.downloadlink
          }" class="btn" id="downloadBtn"><i class="fas fa-download"></i>download</a>
      </div>
  </div>  
`;


// trkListBtn.addEventListener("click", openPlayList)

// function openPlayList(e){
//   e.preventDefault();
//   mixtapePlaylistContainer.classList.toggle('active');
//   console.log('hello');
// }

// global variable with all mixtape data from JSON
// populated after the loadMusicData function calls
let allMixtapeData = null;

async function fetchAllMixtapeData() {
  await fetch("data/mixtapes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("There is a error loading the data file");
      }
      return response.json();
    })
    .then((data) => {
      allMixtapeData = data;
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation",
        error
      );
    });
}

fetchAllMixtapeData().then(() => {
  mixtape.innerHTML = mixtapeToHTML(allMixtapeData.mixtapes[0]);
});

accordionLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    mixtape.innerHTML = mixtapeToHTML(allMixtapeData.mixtapes[link.dataset.id]);
  });
});

// ACCORDION
accordion.addEventListener("click", chooseActiveTab);

function chooseActiveTab(e) {
 const activeTab =  e.target.closest('.tab');
 if(!activeTab) return // used so clicking between accordionTitles doesnt trigger an event.
 toggleAccordion(activeTab);
 console.log(activeTab);
}

// function toggleAccordion(tabToActive) {
//    const tabs = tabToActive.parentElement.querySelectorAll('.tab');

//     tabs.forEach((tab) => {
//       tab.classList.remove('active');
//     })
//   //  tabs.forEach((tab) => {
//   //     if(tab.classList.contains('active')) {
//   //       tab.classList.remove('active');
//   //     } else {
//   //       this.classList.add('active'); 
//   //     }
//   //  })
//   //  tabToActive.querySelector('.tabs').setAttribute('aria-expanded', true);
//   console.log(tabs); 
// }


// MUSIC PLAYER
const player = document.querySelector("#player");
const playerCover = document.querySelector("#playerCover");
const playerTitle = document.querySelector("#playerTitle");
const playerArtist = document.querySelector("#playerArtist");

const audio = document.querySelector("#audio");
const progressContainer = document.querySelector(".progress-container");
const progress = document.querySelector(".progress");
const btnPrev = document.querySelector("#btnPrev");
const btnPlay = document.querySelector("#btnPlay");
const btnNext = document.querySelector("#btnNext");
const musicLinks = document.querySelectorAll(".music-links li a");
const timeContainer = document.querySelector("#timeContainer");

const musicData = document.querySelector('#musicData');
const musicDataURL = "data/music.json";

let songIndex = 0;

loadSong(musicLinks[songIndex]);

function loadSong() {
  musicLinks.forEach(function (musicLink) {
    musicLink.addEventListener("click", function (e) {
      e.preventDefault();
      const songLink = this.getAttribute("data-songLink");
      const songTitle = this.outerText;
      const songCover = this.getAttribute("data-coverart");

      const songArtist = this.getAttribute("data-artist");
      const playerInfo = document.querySelector(".player__info");

      playerInfo.classList.add("active");
      playerCover.setAttribute("src", songCover);
      playerTitle.innerHTML = songTitle;
      playerArtist.innerHTML = songArtist;
      audio.src = songLink;
    });
  });
}


function playSong() {
  player.classList.add("play");
  btnPlay.querySelector("i.fas").classList.remove("fa-play");
  btnPlay.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
}

function pauseSong() {
  player.classList.remove("play");
  btnPlay.querySelector("i.fas").classList.remove("fa-pause");
  btnPlay.querySelector("i.fas").classList.add("fa-play");

  audio.pause();
}

function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = musicLinks.length - 1;
  }
  loadSong(musicLinks[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;

  if (songIndex > musicLinks.length - 1) {
    songIndex = 0;
  }
  loadSong(musicLinks[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { currentTime, duration } = e.srcElement;
  const progressPercentage = (currentTime / duration) * 100;
  let timeDisplay = audio.timeupdate;

  progress.style.width = `${progressPercentage}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

btnPlay.addEventListener("click", () => {
  const isPlaying = player.classList.contains("play");

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

btnPrev.addEventListener("click", prevSong);
btnNext.addEventListener("click", nextSong);

audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);

// COPYRIGHT DATE
const yearToDate = new Date().getFullYear();
const copyrightDate = document.querySelector(".copyright_date");

function updateCopyright() {
  copyrightDate.innerText = yearToDate;
}
updateCopyright();



