const params = new URLSearchParams(window.location.search);
const imageElement = document.getElementById("image-display-image");
const imageTitleElement = document.getElementById("image-display-title");
const imageDescriptionElement = document.getElementById("image-display-description");
const imageDateElement = document.getElementById("image-display-date");
const imageRelatedLinks = document.getElementById("image-related-links");


(async () => {
  const themesData = await fetch("/api/drawingthemes").then((res) => res.json());
  const images = Object.values(themesData).flat();

  const imageUrl = params.get("image");
  const image = images.find((img) => {
    return img.image == imageUrl;
  });

  imageElement.src = image.image;
  imageTitleElement.innerText = image.title;
  imageDescriptionElement.innerText = image.description;
  imageDateElement.innerText = image.date;

  const tags = image.primaryTags;

  const otherImages = images.filter((img) => img != image)

  const imageSet = new Set();

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    
    const matchingImages = otherImages.filter((img) => img.primaryTags && img.primaryTags.includes(tag));
    if (matchingImages.length == 0) {
      continue;
    }

    for (let y = 0; y < 5; y++) {
      const randomNumber = Math.floor(Math.random() * matchingImages.length);
      imageSet.add(matchingImages[randomNumber]);
    }
  }

  const randomImages = [...imageSet].slice(0, 5);

  for (let i = 0; i < randomImages.length; i++) {
    const randomImage = randomImages[i];
    
    const listElement = document.createElement("div");
    const link = document.createElement ("a");

    const isCollection = false
    if (isCollection) {
      link.href = "/work/drawings/collection.html?collection=" + randomImage.collection;
    }
    else {
      link.href = "/work/drawings/image.html?image=" + randomImage.image;
    }
    
    link.innerText = randomImage.title;

    listElement.appendChild(link);
    imageRelatedLinks.appendChild(listElement);
  }
})();