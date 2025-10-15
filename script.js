
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
  navLink.addEventListener('click', (event) => {
    navLinks.forEach((link) => link.classList.remove('active'));
    navLink.classList.add('active');

    const href = navLink.getAttribute('href');
    if (!href || href === '/' || !href.startsWith('#')) {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  });
});


// STICKY NAV
const navBar = document.querySelector('.navbar');
const navElems = document.querySelector('nav ul');
const labelLogos = document.querySelector('.label-logos');
const stickySentinel = document.createElement('div');
const stickyPlaceholder = document.createElement('div');
let currentStackHeight = 0;

stickySentinel.setAttribute('data-scroll-trigger', '');
stickySentinel.style.width = '100%';
stickySentinel.style.height = '1px';
stickySentinel.style.margin = '0';
stickySentinel.style.padding = '0';
stickySentinel.style.opacity = '0';
stickySentinel.style.pointerEvents = 'none';

stickyPlaceholder.setAttribute('data-sticky-placeholder', '');
stickyPlaceholder.style.width = '100%';
stickyPlaceholder.style.height = '0';
stickyPlaceholder.style.margin = '0';
stickyPlaceholder.style.padding = '0';
stickyPlaceholder.style.display = 'block';

if (labelLogos && labelLogos.parentNode) {
  labelLogos.parentNode.insertBefore(stickySentinel, labelLogos);
  labelLogos.parentNode.insertBefore(stickyPlaceholder, labelLogos.nextSibling);
} else if (navBar && navBar.parentNode) {
  navBar.parentNode.insertBefore(stickySentinel, navBar.nextSibling);
  navBar.parentNode.insertBefore(stickyPlaceholder, stickySentinel.nextSibling);
}

const stickyObserver = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];
    if (!entry) {
      return;
    }
    const isStuck = !entry.isIntersecting;
    toggleStickyState(isStuck);
  },
  { threshold: [0, 1], rootMargin: '0px 0px 0px 0px' }
);

if (navBar) {
  calculateStickyStackHeights();
  stickyObserver.observe(stickySentinel);
  requestAnimationFrame(() => {
    const sentinelRect = stickySentinel.getBoundingClientRect();
    toggleStickyState(sentinelRect.top <= 0);
  });
}

let resizeTimerId = null;
window.addEventListener('resize', () => {
  if (!navBar) {
    return;
  }
  window.clearTimeout(resizeTimerId);
  resizeTimerId = window.setTimeout(() => {
    calculateStickyStackHeights();
  }, 150);
});

function toggleStickyState(isStuck) {
  navBar?.classList.toggle('fixed', isStuck);
  labelLogos?.classList.toggle('fixed', isStuck);
  if (navElems) {
    if (isStuck) {
      navElems.classList.add('d-flex');
    } else {
      navElems.classList.remove('d-flex');
    }
  }

  if (stickyPlaceholder) {
    stickyPlaceholder.style.height = isStuck ? `${currentStackHeight}px` : '0px';
  }
}

function calculateStickyStackHeights() {
  if (!navBar) {
    return;
  }

  const navbarHeight = measureElementHeight(navBar, 'fixed');
  const logosHeight = labelLogos ? measureElementHeight(labelLogos, 'fixed') : 0;
  currentStackHeight = navbarHeight + logosHeight;

  document.documentElement.style.setProperty('--navbar-fixed-height', `${navbarHeight}px`);
  document.documentElement.style.setProperty('--sticky-stack-height', `${currentStackHeight}px`);
  document.documentElement.style.setProperty('--sticky-anchor-offset', `${currentStackHeight}px`);
  if (stickyPlaceholder) {
    const isStuck = navBar?.classList.contains('fixed');
    stickyPlaceholder.style.height = isStuck ? `${currentStackHeight}px` : '0px';
  }
}

function measureElementHeight(element, modifierClass) {
  const clone = element.cloneNode(true);
  if (modifierClass) {
    clone.classList.add(modifierClass);
  }
  clone.style.position = 'absolute';
  clone.style.visibility = 'hidden';
  clone.style.pointerEvents = 'none';
  clone.style.top = '-9999px';
  clone.style.left = '0';
  clone.style.width = `${element.getBoundingClientRect().width}px`;
  clone.setAttribute('aria-hidden', 'true');
  document.body.appendChild(clone);
  const height = Math.round(clone.getBoundingClientRect().height);
  document.body.removeChild(clone);
  return height;
}

window.addEventListener('load', calculateStickyStackHeights);


// MIXTAPE COMPONENT
const mixtape = document.querySelector("#mixtape");
const accordionContainer = document.querySelector("#mixtapeAccordion");
let currentMixtapeIndex = 0;

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
          <button class="btn mixtape__btn mixtape__btn--play" type="button" data-playlink="${mixtape.playlink}">
            <i class="fas fa-play" aria-hidden="true" title="Play mixtape"></i>
          </button>
          <a href="${
            mixtape.downloadlink
          }" class="btn mixtape__btn mixtape__btn--download">
            <i class="fas fa-download" aria-hidden="true" title="Download mixtape"></i>
          </a>
      </div>
      <div class="mixtape__player is-hidden" data-mixtape-player>
        <audio class="mixtape__audio" controls preload="none" data-src="${mixtape.playlink}"></audio>
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
  if (!allMixtapeData || !Array.isArray(allMixtapeData.mixtapes)) {
    return;
  }
  buildTapeAccordion(allMixtapeData.mixtapes);
  renderMixtapeByIndex(currentMixtapeIndex);
});

function renderMixtapeByIndex(index) {
  if (!mixtape || !allMixtapeData || !Array.isArray(allMixtapeData.mixtapes)) {
    return;
  }
  const selectedMixtape = allMixtapeData.mixtapes[index];
  if (!selectedMixtape) {
    return;
  }
  currentMixtapeIndex = index;
  mixtape.innerHTML = mixtapeToHTML(selectedMixtape);
  initializeMixtapePlayer();
  highlightActiveCover();
}

function initializeMixtapePlayer() {
  const playButton = mixtape.querySelector(".mixtape__btn--play");
  const audioElement = mixtape.querySelector(".mixtape__audio");
  const playerContainer = mixtape.querySelector("[data-mixtape-player]");
  if (!playButton || !audioElement) {
    return;
  }
  const playIcon = playButton.querySelector("i");
      const dataSrc = audioElement.getAttribute("data-src");
  if (dataSrc && audioElement.src !== dataSrc) {
    audioElement.src = dataSrc;
  }
  if (playerContainer) {
    playerContainer.classList.add("is-hidden");
  }
  const revealPlayer = () => {
    if (playerContainer) {
      playerContainer.classList.remove("is-hidden");
    }
  };
  const updateButtonState = (isPlaying) => {
    if (!playIcon) {
      return;
    }
    playButton.classList.toggle("is-playing", isPlaying);
    playIcon.classList.toggle("fa-play", !isPlaying);
    playIcon.classList.toggle("fa-pause", isPlaying);
  };
  playButton.addEventListener("click", () => {
    revealPlayer();
    if (audioElement.paused) {
      audioElement.play().catch(() => {});
    } else {
      audioElement.pause();
    }
  });
  audioElement.addEventListener("play", () => {
    revealPlayer();
    updateButtonState(true);
  });
  audioElement.addEventListener("pause", () => updateButtonState(false));
  audioElement.addEventListener("ended", () => {
    audioElement.currentTime = 0;
    updateButtonState(false);
  });
}

function buildTapeAccordion(mixtapes = []) {
  if (!accordionContainer) {
    return;
  }

  const genreOrder = [];
  const mixtapesByGenre = mixtapes.reduce((acc, tape, index) => {
    const cleanedGenre = (tape.genre || "Misc").trim();
    if (!acc[cleanedGenre]) {
      acc[cleanedGenre] = [];
      genreOrder.push(cleanedGenre);
    }
    acc[cleanedGenre].push({ ...tape, index });
    return acc;
  }, {});

  const accordionMarkup = genreOrder
    .map((genre, genreIndex) => {
      const normalizedId = `genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${genreIndex}`;
      const isOpen = genreIndex === 0;
      const coverMarkup = mixtapesByGenre[genre]
        .map((item) => {
          const isSelected = item.index === currentMixtapeIndex ? " is-selected" : "";
          return `
            <button
              type="button"
              class="tape-accordion__cover${isSelected}"
              data-mixtape-index="${item.index}"
            >
              <img src="${item.cover}" alt="${item.title} cover art">
              <span>${item.title}</span>
            </button>
          `;
        })
        .join("");

      return `
        <div class="tape-accordion__item${isOpen ? " is-open" : ""}">
          <button
            class="tape-accordion__trigger"
            type="button"
            aria-expanded="${isOpen}"
            aria-controls="${normalizedId}"
          >
            <span>${genre}</span>
            <i class="fa-solid fa-angle-down" aria-hidden="true"></i>
          </button>
          <div
            class="tape-accordion__panel"
            id="${normalizedId}"
            role="region"
            aria-label="${genre} mixtapes"
            ${isOpen ? "" : "hidden"}
          >
            <div class="tape-accordion__grid">
              ${coverMarkup}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  accordionContainer.innerHTML = accordionMarkup;
  highlightActiveCover();
}

function highlightActiveCover() {
  if (!accordionContainer) {
    return;
  }
  accordionContainer
    .querySelectorAll(".tape-accordion__cover")
    .forEach((button) => {
      const idx = Number(button.dataset.mixtapeIndex);
      const isSelected = idx === currentMixtapeIndex;
      button.classList.toggle("is-selected", isSelected);
    });
}

if (accordionContainer) {
  accordionContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest(".tape-accordion__trigger");
    if (trigger) {
      const item = trigger.closest(".tape-accordion__item");
      if (!item) {
        return;
      }
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      accordionContainer
        .querySelectorAll(".tape-accordion__item")
        .forEach((accordionItem) => {
          const shouldExpand = accordionItem === item ? !isExpanded : false;
          setAccordionState(accordionItem, shouldExpand);
        });
      return;
    }

    const coverButton = event.target.closest(".tape-accordion__cover");
    if (coverButton) {
      const index = Number(coverButton.dataset.mixtapeIndex);
      if (!Number.isNaN(index)) {
        renderMixtapeByIndex(index);
      }
    }
  });
}

function setAccordionState(item, expand) {
  const trigger = item.querySelector(".tape-accordion__trigger");
  const panel = item.querySelector(".tape-accordion__panel");

  if (!trigger || !panel) {
    return;
  }

  trigger.setAttribute("aria-expanded", expand ? "true" : "false");
  item.classList.toggle("is-open", expand);

  if (expand) {
    panel.removeAttribute("hidden");
  } else {
    panel.setAttribute("hidden", "");
  }
}


// MUSIC PLAYER
const player = document.querySelector("#player");
const playerCover = document.querySelector("#playerCover");
const playerTitle = document.querySelector("#playerTitle");
const playerArtist = document.querySelector("#playerArtist");
const playerInfo = document.querySelector(".player__info");

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

if (musicLinks.length) {
  loadSong(musicLinks[songIndex]);
}

function loadSong(linkElement, { autoPlay = false } = {}) {
  if (!linkElement) {
    return;
  }
  const songLink = linkElement.getAttribute("data-songLink");
  const songTitle = linkElement.textContent;
  const songCover = linkElement.getAttribute("data-coverart");
  const songArtist = linkElement.getAttribute("data-artist");
  playerInfo.classList.add("active");
  playerCover.setAttribute("src", songCover);
  playerTitle.textContent = songTitle;
  playerArtist.textContent = songArtist;
  audio.src = songLink;
  if (autoPlay) {
    playSong();
  } else {
    pauseSong();
  }
}

musicLinks.forEach((musicLink, index) => {
  musicLink.addEventListener("click", (e) => {
    e.preventDefault();
    songIndex = index;
    loadSong(musicLink, { autoPlay: true });
  });
});


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
  if (!musicLinks.length) {
    return;
  }
  songIndex--;
  if (songIndex < 0) {
    songIndex = musicLinks.length - 1;
  }
  loadSong(musicLinks[songIndex], { autoPlay: true });
}

function nextSong() {
  if (!musicLinks.length) {
    return;
  }
  songIndex++;
  if (songIndex > musicLinks.length - 1) {
    songIndex = 0;
  }
  loadSong(musicLinks[songIndex], { autoPlay: true });
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
