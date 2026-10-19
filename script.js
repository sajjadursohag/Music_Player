
const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const titleElement = document.getElementById("song-title");
const artistElement = document.getElementById("song-artist");
const currentTimeElement = document.getElementById("current-time");
const durationElement = document.getElementById("duration");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const trackCount = document.getElementById("track-count");

// Replace these filenames with your own MP3 files.
const songs = [
  {
    title: "Amar Sonar Bangla",
    artist: "Artist One",
    src: "songs/song-1.mp3",
  },
  {
    title: "Baba Koto Din",
    artist: "James",
    src: "songs/song-2.mp3",
  },
  {
    title: "Maa go",
    artist: "Artist Three",
    src: "songs/song-3.mp3",
  },
  {
    title: "Surah Rahman",
    artist: "Artist Three",
    src: "songs/Surah_Rahman.mp3",
  },
];

let currentSongIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function loadSong(index) {
  currentSongIndex = (index + songs.length) % songs.length;

  const song = songs[currentSongIndex];

  audio.pause();
  audio.src = song.src;
  audio.load();

  titleElement.textContent = song.title;
  artistElement.textContent = song.artist;
  currentTimeElement.textContent = "0:00";
  durationElement.textContent = "0:00";
  progress.value = 0;

  trackCount.textContent =
    `TRACK ${String(currentSongIndex + 1).padStart(2, "0")} / ${String(songs.length).padStart(2, "0")}`;

  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Play music");
}

async function playSong() {
  try {
    await audio.play();
  } catch (error) {
    console.error("Unable to play audio:", error);
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play music");
  }
}

function togglePlay() {
  if (audio.paused) {
    playSong();
  } else {
    audio.pause();
  }
}

function nextSong() {
  loadSong(currentSongIndex + 1);
  playSong();
}

function previousSong() {
  // Restart the current track if it has played for over 3 seconds.
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  loadSong(currentSongIndex - 1);
  playSong();
}

playButton.addEventListener("click", togglePlay);
nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", previousSong);

audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  playButton.setAttribute("aria-label", "Pause music");
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Play music");
});

audio.addEventListener("loadedmetadata", () => {
  durationElement.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeElement.textContent = formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  } else {
    progress.value = 0;
  }
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.addEventListener("ended", nextSong);

audio.addEventListener("error", () => {
  console.error(
    `Could not load "${songs[currentSongIndex].src}". Check the file path.`
  );
});

audio.volume = Number(volume.value);
loadSong(0);
