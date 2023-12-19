// Function to convert coordinates
function convertCoordinates(latitude, longitude) {
  const lat = parseFloat(latitude) / 10000;
  const lon = parseFloat(longitude) / 10000;

  return { lat, lon };
}

//function to calculate the lat and lon from the recieved data

function latAndLonCoordinates(latitude, longitude) {
  const lat =  Number(latitude.slice(0, 2)) + Number((latitude.substring(3, 8)/60));
  const lon =  Number(longitude.slice(0, 2)) + Number((longitude.substring(3, 8)/60));
  console.log(lat, lon);
  return {lat, lon}
}

// Function to display markers on the map
function displayMarkersOnMap(data) {
  const defaultLocation = [51.505, -0.09];
  const map = L.map("map").setView(defaultLocation, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "",
  }).addTo(map);

  const markers = [];
  const markerGroup = L.layerGroup().addTo(map);

  data.forEach((item) => {
    const { lat, lon } = latAndLonCoordinates(item.lat, item.lon);
    const marker = L.marker([lat, lon]).addTo(markerGroup).bindPopup(item.name);
    markers.push({ marker, lat, lon });
  });

  return { map, markers };
}

// Fetch data and display
const MainURL = "http://elenavts.com/locationmarker/";
const fetchedData = [];

fetch(MainURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("The data is not fetched");
    }
    return response.json();
  })
  .then((data) => {
    fetchedData.push(...data);
    const { map, markers } = displayMarkersOnMap(fetchedData);
    displayDataInTable(fetchedData, markers, map);
    console.log(fetchedData);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Display data in table
function displayDataInTable(data, markers, map) {
  const tableBody = document.getElementById("vehicleData");

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = item.id;
    row.appendChild(idCell);

    const deviceIdCell = document.createElement("td");
    deviceIdCell.textContent = item.deviceId;
    row.appendChild(deviceIdCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    const locateCell = document.createElement("td");
    const locateButton = document.createElement("button");
    locateButton.textContent = "Locate";

    //track click function

    locateButton.onclick = function () {
      const { lat, lon } = markers[index];
      map.panTo([lat, lon]);
      map.setZoom(20);
      const center = map.getCenter();
      console.log("Center coordinates:", center.lat, center.lng);
    };
    locateCell.appendChild(locateButton);
    row.appendChild(locateCell);

    tableBody.appendChild(row);
  });
}
