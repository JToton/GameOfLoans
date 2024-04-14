// *API KEY Entry and fetch URL.
const youTubeApiKey = "AIzaSyBVd9Fn_22Glar1jMSqBFTOv18yGy1ICkk";

const investingChannels = [
  {
    channelName: "GrahamStephan",
    id: "UCV6KDgJskWaEckne5aPA0aQ",
  },
  {
    channelName: "MeetKevin",
    id: "UCUvvj5lwue7PspotMDjk5UA",
  },
  {
    channelName: "BiggerPockets",
    id: "UCVWDbXqQ8cupuVpotWNt2eg",
  },
  {
    channelName: "investor_weekly",
    id: "UCo_E54zSKyuQpG2PNUMbQng",
  },
  {
    channelName: "DougPolkCrypto",
    id: "UC4sS8q8E5ayyghbhiPon4uw",
  },
  {
    channelName: "CNBCMakeIt",
    id: "UCH5_L3ytGbBziX0CLuYdQ1Q",
  },
];

const savingsChannels = [
  {
    channelName: "thefinancialdiet",
    id: "UCSPYNpQ2fHv9HJ-q6MIMaPw",
  },
  {
    channelName: "FrugalFitMom",
    id: "UCdzq21gdrw1k5jw6xzaCADg",
  },
  {
    channelName: "jordanpagecompany",
    id: "UCIBM8DAHoehmJ7_LSLDkB3A",
  },
  {
    channelName: "eWasteBen",
    id: "UCMNtGapF13fwDLMR_sHmi6g",
  },
  {
    channelName: "freakinfrugal5268",
    id: "UCR4u4zBm37-uODgDlvsu7Bg",
  },
  {
    channelName: "MomTheEbayer101",
    id: "UCez9rG7-mnFtq4wpqA9zfXQ",
  },
  {
    channelName: "ExploringAlternatives",
    id: "UC8EQAfueDGNeqb1ALm0LjHA",
  },
  {
    channelName: "TinyHouseExpedition",
    id: "CmpHOZ6GqCvcWyPX3svgz-g",
  },
];

const spendingChannels = [
  {
    channelName: "luxurytravelexpert",
    id: "UCYxsXxbjJO1YYa9yQ3lKC8w",
  },
  {
    channelName: "Archdigest",
    id: "UC0k238zFx-Z8xFH0sxCrPJg",
  },
  {
    channelName: "EnesYilmazer",
    id: "UCHWbZM3BIGgZksvXegx_h3w",
  },
  {
    channelName: "erikvanconover",
    id: "UCu8ucb1LRJd1gwwXutYDgTg",
  },
  {
    channelName: "sothebysrealty",
    id: "UCNZ3t1dMKJGl6-kV9BD5Lqg",
  },
  {
    channelName: "SupercarBlondie",
    id: "UCKSVUHI9rbbkXhvAXK-2uxA",
  },
  {
    channelName: "DenisonYachting",
    id: "UCrS7LVKWs4YIJNWgW3cM6sw",
  },
  {
    channelName: "SamChui",
    id: "UCfYCRj25JJQ41JGPqiqXmJw",
  },
];

async function fetchChannelId(apiKey, channelName) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    channelName
  )}&type=channel&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items.length > 0) {
      console.log("Fetched Channel ID: ", data.items[0].id.channelId);
      return data.items[0].id.channelId;
    } else {
      console.error("No channel found with that name.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching channel ID:", error);
    return null;
  }
}

async function fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId) {
  const uploadsPlaylistId = `UU${randomChannelId.substring(2)}`;
  console.log(uploadsPlaylistId);
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=25&key=${youTubeApiKey}`;
  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      console.log('No videos found.');
      return null; // No videos to return
    }

    // Selecting a random video from the fetched items
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const randomVideo = data.items[randomIndex];
    const videoDetails = {
      title: randomVideo.snippet.title,
      videoId: randomVideo.snippet.resourceId.videoId,
      description: randomVideo.snippet.description,
      publishedAt: randomVideo.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${randomVideo.snippet.resourceId.videoId}`,
    };
    console.log(videoDetails);
    return videoDetails;
  } catch (error) {
    console.error(`Error fetching videos: ${error}`);
    return null; // Return null or handle error as appropriate
  }
}

function createVideoModal() {
  // Modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "videoModal";
  modalOverlay.className =
    "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden";
  modalOverlay.addEventListener("click", closeModal);

  // Modal content box
  const modalContent = document.createElement("div");
  modalContent.id = "modalContent";
  modalContent.className =
    "fixed left-1/4 right-1/4 top-10 p-5 border w-1/2 shadow-lg rounded-md bg-white hidden";

  // Close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.className = "text-2xl text-right";
  closeButton.onclick = closeModal;

  // Title
  const videoTitle = document.createElement("h3");
  videoTitle.id = "videoTitle";
  videoTitle.className = "text-lg leading-6 font-medium text-gray-900";

  // Description
  const videoDescription = document.createElement("p");
  videoDescription.id = "videoDescription";

  // Video frame
  const videoFrame = document.createElement("iframe");
  videoFrame.id = "videoFrame";
  videoFrame.width = "100%";
  videoFrame.height = "315";
  videoFrame.frameBorder = "0";
  videoFrame.allowFullscreen = true;
  videoFrame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

  // Appending all elements
  modalContent.appendChild(closeButton);
  modalContent.appendChild(videoTitle);
  modalContent.appendChild(videoDescription);
  modalContent.appendChild(videoFrame);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

function closeModal() {
  document.getElementById("videoModal").classList.add("hidden");
  document.getElementById("modalContent").classList.add("hidden");
  document.getElementById("videoFrame").src = "";
}

// Create the modal content cont

function displayVideoModal(video) {
  document.getElementById("videoTitle").textContent = video.title;
  document.getElementById("videoDescription").textContent = video.description;
  document.getElementById(
    "videoFrame"
  ).src = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;
  document.getElementById("videoModal").classList.remove("hidden");
  document.getElementById("modalContent").classList.remove("hidden");
}

async function getRandomspendingChannel() {
  console.log("Firing getRandomspendingChannel because income is high.");
  // Implement the logic for high income
  const randomIndex = Math.floor(Math.random() * spendingChannels.length);
  const randomChannelId = spendingChannels[randomIndex].id;
  const videoData = await fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId);
  displayVideoModal(videoData);
}

async function getInvestingChannel() {
  console.log("Firing getInvestingChannel because the mood is positive.");
  // Implement the logic for happy money
  const randomIndex = Math.floor(Math.random() * investingChannels.length);
  const randomChannelId = investingChannels[randomIndex].id;
  fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId);
  const videoData = await fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId);
  displayVideoModal(videoData);
}

async function getSavingsChannel() {
  console.log("Firing getSavingsChannel because the mood is negative.");
  // Implement the logic for sad money
  const randomIndex = Math.floor(Math.random() * savingsChannels.length);
  const randomChannelId = savingsChannels[randomIndex].id;
  fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId);
  const videoData = await fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId);
  displayVideoModal(videoData);
}

document.getElementById("incomeSubmit").addEventListener("click", function () {
  const income = parseInt(document.getElementById("incomeInput").value, 10);
  if (income > 200000) {
    getRandomspendingChannel();
  }
});

document.getElementById("calculateSadHappyMoney").addEventListener("click", function () {
  console.log("Button clicked");
  const storedFinancialStatus = parseInt(localStorage.getItem('financialStatus'), 10);
  console.log(storedFinancialStatus);  // Retrieve the stored financial status
  if (storedFinancialStatus > 0) {
    getInvestingChannel();
  } else if (storedFinancialStatus <= 0) {
    getSavingsChannel();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  createVideoModal();
});
