let isAdmin = false;

const ADMIN_PASSWORD = "admin#48338@9436185234";

let animeCounter = 0;

const adminLoginBtn = document.getElementById("adminLoginBtn");

const uploadForm = document.getElementById("uploadForm");

const uploadBtn = document.getElementById("uploadBtn");

const animeLibrary = document.getElementById("animeLibrary");

const searchBar = document.getElementById("searchBar");

const playerView = document.getElementById("playerView");

const videoPlayer = document.getElementById("videoPlayer");

const backArrow = document.getElementById("backArrow");

const episodeSelector = document.getElementById("episodeSelector");

adminLoginBtn.addEventListener("click", () => {

  if (isAdmin) {

    isAdmin = false;

    uploadForm.style.display = "none";

    adminLoginBtn.textContent = "Admin Login";

    updateAdminButtons();

  } else {

    const pass = prompt("Enter admin password:");

    if (pass === ADMIN_PASSWORD) {

      isAdmin = true;

      uploadForm.style.display = "block";

      adminLoginBtn.textContent = "Logout";

      updateAdminButtons();

    } else {

      alert("Wrong password!");

    }

  }

});

uploadBtn.addEventListener("click", () => {

  const title = document.getElementById("animeTitle").value;

  const genre = document.getElementById("animeGenre").value;

  const desc = document.getElementById("animeDescription").value;

  const thumbFile = document.getElementById("animeThumbnail").files[0];

  const videoFile = document.getElementById("animeVideo").files[0];

  if (!title || !genre || !desc || !thumbFile || !videoFile) {

    alert("Please fill all fields.");

    return;

  }

  const reader = new FileReader();

  reader.onload = function(e) {

    const card = document.createElement("div");

    card.className = "anime-card";

    card.dataset.animeId = ++animeCounter;

    card.innerHTML = `

      <img src="${e.target.result}" alt="${title}" />

      <div class="info">

        <h3>${title}</h3>

        <p>${desc}</p>

        <div class="badges"><span>${genre}</span></div>

        <div class="episode-list"></div>

        <button class="play-button">Play</button>

        <input type="file" class="episode-upload" accept="video/*" multiple style="display:none" />

        <button class="plus-btn" style="display:none">＋</button>

        <button class="delete-btn" style="display:none">Delete</button>

      </div>

    `;

    animeLibrary.appendChild(card);

    const episodeList = card.querySelector(".episode-list");

    const playBtn = card.querySelector(".play-button");

    const plusBtn = card.querySelector(".plus-btn");

    const delBtn = card.querySelector(".delete-btn");

    const epInput = card.querySelector(".episode-upload");

    let episodes = [{ name: "Episode 1", file: videoFile }];

    function renderEpisodeButtons() {

      episodeSelector.innerHTML = "";

      episodes.forEach((ep, index) => {

        const epBtn = document.createElement("button");

        epBtn.textContent = ep.name;

        epBtn.className = "episode-button";

        epBtn.addEventListener("click", () => {

          const url = URL.createObjectURL(ep.file);

          videoPlayer.src = url;

          videoPlayer.play();

        });

        if (isAdmin) {

          const delEp = document.createElement("span");

          delEp.textContent = " ✖";

          delEp.style.color = "crimson";

          delEp.style.cursor = "pointer";

          delEp.onclick = () => {

            episodes.splice(index, 1);

            renderEpisodeButtons();

          };

          epBtn.appendChild(delEp);

        }

        episodeSelector.appendChild(epBtn);

      });

    }

    playBtn.addEventListener("click", () => {

      renderEpisodeButtons();

      const firstEp = episodes[0];

      if (firstEp) {

        const url = URL.createObjectURL(firstEp.file);

        videoPlayer.src = url;

        videoPlayer.play();

        playerView.style.display = "block";

        animeLibrary.style.display = "none";

      }

    });

    plusBtn.addEventListener("click", () => epInput.click());

    epInput.addEventListener("change", () => {

      [...epInput.files].forEach((file, i) => {

        episodes.push({

          name: `Episode ${episodes.length + 1}`,

          file

        });

      });

      alert("Episode(s) added.");

    });

    delBtn.addEventListener("click", () => card.remove());

    updateAdminButtons();

  };

  reader.readAsDataURL(thumbFile);

});

function updateAdminButtons() {

  document.querySelectorAll(".plus-btn, .delete-btn, .episode-upload").forEach(el => {

    el.style.display = isAdmin ? "inline-block" : "none";

  });

}

searchBar.addEventListener("input", () => {

  const term = searchBar.value.toLowerCase();

  document.querySelectorAll(".anime-card").forEach(card => {

    const title = card.querySelector("h3").textContent.toLowerCase();

    card.style.display = title.includes(term) ? "block" : "none";

  });

});

backArrow.addEventListener("click", () => {

  playerView.style.display = "none";

  animeLibrary.style.display = "grid";

  videoPlayer.pause();

});