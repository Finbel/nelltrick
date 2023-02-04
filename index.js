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
  const indices = []
  for (let i = 0; i < possibilities.length; i++) {
    console.log('pushing', i)
    indices.push(i)
  }
  console.log({ 'possibilities.length': possibilities.length })

  const shuffledIndices = [...indices].sort(() => 0.5 - Math.random())
  let currentIndex = 0
  const imagesOnScreen = imagesNeededToFillScreen()
  while (currentIndex < imagesOnScreen && currentIndex < possibilities.length) {
    const index = shuffledIndices[currentIndex]
    console.log({ currentIndex, index })
    const { artist, motifId } = possibilities[index]
    appendMotifImage(images, artist, motifId, currentIndex)
    currentIndex++
  }
  console.log(possibilities.length)

  setInterval(() => {
    const images = document.getElementsByClassName('startpage-image-container')
    const randomImage = images[Math.floor(Math.random() * images.length)]
    randomImage.classList.add('invisible')
    setTimeout(() => {
      const imageElement = randomImage.getElementsByTagName('img')[0]
      const index = shuffledIndices[currentIndex]
      console.log({ currentIndex, index })
      const { artist, motifId } = possibilities[index]
      const imageSrc = `../images/${artist.id}/${motifId}.png`
      imageElement.src = imageSrc
      randomImage.onclick = makeClickHandler(imageSrc, motifId, artist)
      imageElement.onload = () => {
        randomImage.classList.remove('invisible')
      }
    }, 2500)
    currentIndex = (currentIndex + 1) % possibilities.length
  }, 3000)
}

const getImagesPerRow = (width) => {
  if (width > 1000) {
    return 8
  }
  if (width > 800) {
    return 5
  }
  if (width > 500) {
    return 4
  }
  return 3
}

function imagesNeededToFillScreen() {
  const width = window.innerWidth
  const imagesPerRow = getImagesPerRow(width)
  // i.e. 400
  const height = window.innerHeight
  // i.e. 821
  const heightToWidthratio = height / width
  // i.e. 2.0525
  console.log(width, height, heightToWidthratio)
  // if we have imagesPerRow in width
  // we should have Ceil(heightToWidthratio) * imagesPerRow images in height
  const imagesPerColumn = Math.ceil(heightToWidthratio) * imagesPerRow
  // and imagesPerRow * imagesPerColumn in total
  console.log(imagesPerRow * imagesPerColumn)
  return imagesPerRow * imagesPerColumn
}

function appendMotifImage(images, artist, motifId, currentIndex) {
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
