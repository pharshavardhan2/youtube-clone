const api_key = "AIzaSyBU4_stGFL7s4foz42NYGkSOKEfK4u1Bp8";
const client_id =
  "623447255696-72bi6fcaotctg7sgmjpc0r07s3bpnvv0.apps.googleusercontent.com";
const videos_api = "https://www.googleapis.com/youtube/v3/videos?";
const channels_api = "https://www.googleapis.com/youtube/v3/channels?";
const search_api = "https://www.googleapis.com/youtube/v3/search?";
const videos = document.querySelector(".videos");
const searchBtn = document.querySelector(".search");
const advSearchBtn = document.querySelector(".adv-search");
const channel = document.querySelector(".channel-content");
const chanBtn = document.querySelector(".channel-btn");
const container = document.querySelector(".container");
const home = document.getElementById("home");
let googleAuth;
const SCOPE = "https://www.googleapis.com/auth/youtube.readonly";
let channelName = "techguyweb";

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  discoveryUrl = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";
  gapi.client
    .init({
      apiKey: api_key,
      clientId: client_id,
      discoveryDocs: [discoveryUrl],
      scope: SCOPE,
    })
    .then(function () {
      googleAuth = gapi.auth2.getAuthInstance();
      googleAuth.isSignedIn.listen(updateSigninStatus);

      let user = googleAuth.currentUser.get();
      setSigninStatus();

      $("#auth-btn").click(function () {
        handleAuthClick();
      });
    });
}

function handleAuthClick() {
  if (googleAuth.isSignedIn.get()) {
    googleAuth.signOut();
  } else {
    googleAuth.signIn();
  }
}

function setSigninStatus() {
  let user = googleAuth.currentUser.get();
  let isAuthorized = user.hasGrantedScopes(SCOPE);
  const status = document.querySelector(".status");
  if (isAuthorized) {
    status.innerHTML = "Sign Out";
  } else {
    status.innerHTML = "Sign In";
  }
}

function updateSigninStatus() {
  setSigninStatus();
}

fetch(
  videos_api +
    new URLSearchParams({
      key: api_key,
      part: "snippet, statistics",
      chart: "mostPopular",
      maxResults: 40,
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.items.forEach((item) => {
      getChannelBanner(item);
    });
  })
  .catch((err) => console.log(err));

function getChannelBanner(video) {
  fetch(
    channels_api +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video.channelBanner = data.items[0].snippet.thumbnails.default.url;
      addVideoArticle(video);
    });
}

function addVideoArticle(data) {
  videos.innerHTML += `<article class="video" onclick="location.href='https://youtube.com/watch?v=${data.id}'">
    <img src=${data.snippet.thumbnails.standard.url} alt="" class="thumbnail" />
    <div class="info">
      <img src=${data.channelBanner} alt="" class="channel-icon" />
      <div class="text">
        <h2>${data.snippet.title}</h2>
        <p>${data.snippet.channelTitle}</p>
        <p>${data.statistics.viewCount} views</p>
      </div>
    </div>
  </article>`;
}

chanBtn.addEventListener("click", handleChannelClick);

function handleChannelClick() {
  home.style.display = "none";
  channel.style.display = "flex";
}
