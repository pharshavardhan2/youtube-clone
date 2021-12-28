const api_key = "AIzaSyCGuhovup1WSsvmE0AZl9JUv_gcFEr8qfo";
const client_id =
  "471306445863-dj69m3e4cmq1hmf3a4fhhd55121n96cm.apps.googleusercontent.com";
const videos_api = "https://www.googleapis.com/youtube/v3/videos?";
const channels_api = "https://www.googleapis.com/youtube/v3/channels?";
const search_api = "https://www.googleapis.com/youtube/v3/search?";
const videos = document.querySelector(".videos");
const searchBtn = document.querySelector(".search");
const advSearchBtn = document.querySelector(".adv-search");
let googleAuth;
const SCOPE = "https://www.googleapis.com/auth/youtube";

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
  let isAuthorized = user.hasGrantedScoepes(SCOPE);
  if (isAuthorized) {
    $("#auth-btn").html("Sign Out");
  } else {
    $("#auth-btn").html("Sign In");
  }
}

function updateSigninStatus() {
  setSigninStatus();
}

// fetch(
//   videos_api +
//     new URLSearchParams({
//       key: api_key,
//       part: "snippet, statistics",
//       chart: "mostPopular",
//       maxResults: 40,
//       videoCategoryId: 28,
//     })
// )
//   .then((res) => res.json())
//   .then((data) => {
//     data.items.forEach((item) => {
//       getChannelBanner(item);
//     });
//   })
//   .catch((err) => console.log(err));

// function getChannelBanner(video) {
//   fetch(
//     channels_api +
//       new URLSearchParams({
//         key: api_key,
//         part: "snippet",
//         id: video.snippet.channelId,
//       })
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       video.channelBanner = data.items[0].snippet.thumbnails.default.url;
//       addVideoArticle(video);
//     });
// }

// function addVideoArticle(data) {
//   videos.innerHTML += `<article class="video" onclick="location.href='https://youtube.com/watch?v=${data.id}'">
//     <img src=${data.snippet.thumbnails.standard.url} alt="" class="thumbnail" />
//     <div class="info">
//       <img src=${data.channelBanner} alt="" class="channel-icon" />
//       <div class="text">
//         <h2>${data.snippet.title}</h2>
//         <p>${data.snippet.channelTitle}</p>
//         <p>${data.statistics.viewCount} views</p>
//       </div>
//     </div>
//   </article>`;
// }

// searchBtn.addEventListener("click", defaultSearch());

// function defaultSearch() {
//   const query = document.querySelector(".search-txt");
//   if (query.value) {
//       fetch(search_api + new URLSearchParams({
//           key: api_key,
//           part:
//       }))
//   }
// }
