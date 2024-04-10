// *API KEY Entry and fetch URL.
function fetchPolygon() {
  //const API_KEY = "5667ef7603dd741b21df3d50b26b2900";
  const API_URL = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&apiKey=e9Iazy3Khea9mBmmpMpbxDbpTQBup3ec`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })

    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
/* fetchPolygon(); */
