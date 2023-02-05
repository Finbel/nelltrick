const getNextImageIndexFunction = (imagesOnScreen) => {
  const indices = []
  for (let i = 0; i < imagesOnScreen; i++) {
    indices.push(i)
  }
  const shuffledIndices = [...indices].sort(() => 0.5 - Math.random())
  let currentIndex = 0
  return () => {
    const index = shuffledIndices[currentIndex]
    currentIndex = (currentIndex + 1) % imagesOnScreen
    return index
  }
}

const getNextPossibilityFunction = (possibilities) => {
  const indices = []
  for (let i = 0; i < possibilities.length; i++) {
    indices.push(i)
  }
  const shuffledIndices = [...indices].sort(() => 0.5 - Math.random())
  let currentIndex = 0
  return () => {
    const index = shuffledIndices[currentIndex]
    currentIndex = (currentIndex + 1) % possibilities.length
    return possibilities[index]
  }
}

const images = document.getElementById('images')
fetch(`./artists.json`)
  .then((response) => response.json())
  .then(({ artists }) => {
    fetch(`./motifs.json`)
      .then((response) => response.json())
      .then(({ motifs }) => {
        generate(artists, motifs)
      })
  })

function generate(artists, motifs) {
  const possibilities = artists
    .map((artist) => motifs.map((motifId) => ({ artist, motifId })))
    .flat()

  const imagesOnScreen = imagesNeededToFillScreen()
  const getNextPossibility = getNextPossibilityFunction(possibilities)

  for (let i = 0; i < imagesOnScreen; i++) {
    const { artist, motifId } = getNextPossibility()
    appendMotifImage(images, artist, motifId)
  }
  const getNextImageIndex = getNextImageIndexFunction(imagesOnScreen)
  setInterval(() => {
    const images = document.getElementsByClassName('startpage-image-container')
    const index = getNextImageIndex()
    const randomImage = images[index]
    randomImage.classList.add('invisible')
    setTimeout(() => {
      const imageElement = randomImage.getElementsByTagName('img')[0]
      const { artist, motifId } = getNextPossibility()
      const imageSrc = `./images/${artist.id}/${motifId}.png`
      imageElement.src = imageSrc
      randomImage.onclick = makeClickHandler(imageSrc, motifId, artist)
      imageElement.onload = () => {
        randomImage.classList.remove('invisible')
      }
    }, 2500)
  }, 3500)
}

const getImagesPerRow = (width) => {
  if (width > 800) {
    return 5
  }
  if (width > 500) {
    return 4
  }
  return 3
}

function imagesNeededToFillScreen() {
  // First we need to see how many images we have in a row
  const width = window.innerWidth
  const imagesPerRow = getImagesPerRow(width)
  // from that we can calculate the length of the side of an image
  const lengthOfSide = width / imagesPerRow
  // and from that together with the height we can calculate
  // how many rows of images we will have
  const height = window.innerHeight
  const numberOfRows = height / lengthOfSide
  // We'll round up to make sure to fill the screen
  return Math.ceil(numberOfRows) * imagesPerRow
}

function appendMotifImage(images, artist, motifId) {
  const artistId = artist.id
  const imageSrc = `../images/${artistId}/${motifId}.png`
  const prettyName = prettyMotifName(motifId)
  const container = document.createElement('div')
  container.classList.add('startpage-image-container', 'invisible')
  container.classList.add('startpage-image-container', 'invisible')
  const motifImage = document.createElement('img')
  motifImage.src = imageSrc
  const motifText = document.createElement('p')
  motifText.innerText = prettyName
  container.appendChild(motifImage)
  container.appendChild(motifText)
  images.appendChild(container)
  container.onclick = makeClickHandler(imageSrc, motifId, artist)
  motifImage.onerror = () => {
    images.removeChild(container)
  }
  motifImage.onload = () => {
    container.classList.remove('invisible')
  }
}

function makeClickHandler(imageSrc, motifId, artist) {
  const clickHandler = () => {
    const image = document.createElement('img')
    image.classList.add('modal-image')
    image.src = imageSrc
    const backdrop = document.createElement('div')

    const title = document.createElement('p')

    const motifName = document.createElement('a')
    motifName.innerText = prettyMotifName(motifId)
    motifName.href = `../motif/index.html?motif=${motifId}`
    motifName.classList.add('motif-title', 'fs-600')

    const text = document.createTextNode(' by ')
    title.classList.add('motif-title', 'fs-600')

    const artistName = document.createElement('a')
    artistName.innerText = artist.name
    artistName.href = `../artist/index.html?artist=${artist.id}`
    artistName.classList.add('motif-title', 'fs-600')

    title.appendChild(motifName)
    title.appendChild(text)
    title.appendChild(artistName)

    title.href = `../motif/index.html?motif=${motifId}`
    backdrop.classList.add('backdrop')
    backdrop.appendChild(image)
    backdrop.appendChild(title)
    document.body.appendChild(backdrop)
    backdrop.onclick = () => document.body.removeChild(backdrop)
  }
  return clickHandler
}

function prettyMotifName(motifId) {
  const firstLetter = motifId[0]
  const restOfName = motifId.slice(1)
  return `${firstLetter.toUpperCase()}${restOfName.replaceAll('_', ' ')}`
}
