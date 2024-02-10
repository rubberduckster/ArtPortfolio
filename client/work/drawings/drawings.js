let selectedTheme = "";
let themesData = {};

function setTheme(theme) {
  selectedTheme =theme;
  document.title = theme;

  let images = [];
  const isCollection = selectedTheme == "_collections";

  if (selectedTheme == "") {
    const keys = Object.keys(themesData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const items = themesData[key];
      images.push(...items)
    }
  }
  else if (isCollection) {
    const keys = Object.keys(themesData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const items = themesData[key];
      images.push(...items)
    }

    const collectionObject = {};
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image.collections) {
        for (let y = 0; y < image.collections.length; y++) {
          const collection = image.collections[y];
          if (!collectionObject[collection]) {
            collectionObject[collection] = [];
          }
          collectionObject[collection].push(image);
        }
      }
    }
    images = Object.entries(collectionObject).map(([key, value]) => {
      const lastImage = value[value.length - 1]
      return {
        ...lastImage,
        collection: key
      }
    })
  }
  else {
    const items = themesData[selectedTheme];
    images.push(...items)
  }

  const drawingPreviews = document.getElementById("drawing-previews");
  drawingPreviews.innerHTML = "";

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const div = document.createElement("div");
    div.classList.add("drawing-preview-container");
    const img = new Image();

    const link = document.createElement ("a");

    if (isCollection) {
      link.href = "/work/drawings/collection.html?collection=" + image.collection;
    }
    else {
      link.href = "/work/drawings/image.html?image=" + image.image;
    }


    link.appendChild(img);

    div.appendChild(link);

    img.src = image.image;

    if (image.position) {
      const [x, y] = image.position;
    img.style.objectPosition = `${x}px ${y}px`;
    }

    if (isCollection) {
      img.style.filter = "blur(1px) brightness(0.9)"
      const textTitle = document.createElement("h3");
      textTitle.innerText = image.collection;
      textTitle.style.position = "absolute";
      div.appendChild(textTitle);
    }

    drawingPreviews.appendChild(div);
  }
}

async function getDrawingThemes() {
  const themesData = await fetch("/api/drawingthemes").then((res) => res.json());
  const themes = Object.keys(themesData);

  console.log(themes);
  const themeList = document.getElementById("drawing-theme-list");
  
  const div = document.createElement("div");
  div.innerText = "All";
  div.classList.add("drawing-theme");
  div.addEventListener("click", () => setTheme(""));
  themeList.appendChild(div);

  for (let i = 0; i < themes.length; i++) {
    const theme = themes[i];
    
    const div = document.createElement("div");
    div.innerText = theme;
    div.classList.add("drawing-theme");

    div.addEventListener("click", () => setTheme(theme));

    themeList.appendChild(div);
  }

  const collectionDiv = document.createElement("div");
  collectionDiv.innerText = "Collections";
  collectionDiv.classList.add("drawing-theme");
  collectionDiv.addEventListener("click", () => setTheme("_collections"));
  themeList.appendChild(collectionDiv);

  return themesData;
}

getDrawingThemes().then((data) => {
  themesData = data
  setTheme("");
});