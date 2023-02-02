const title = document.getElementById('title')
const text = document.getElementById('text')
const portrait = document.getElementById('portrait')
const images = document.getElementById('images')

const params = new URL(document.location).searchParams
const motifId = params.get('motif')

// portrait.src = `../images/${motifId}/bg.png`

// Set the artist title
title.innerText = prettyMotifName(motifId)
if (prettyMotifName(motifId).length > 15) {
  title.classList.remove('fs-800')
  title.classList.add('fs-700')
}

fetch(`../artists.json`)
  .then((response) => response.json())
  .then(({ artists }) => {
    artists.forEach((artist) => appendMotifImage(images, artist, motifId))
    // Now we need to fetch all the motifs
  })
  .catch((error) => console.log(error))

function appendMotifImage(images, artist, motifId) {
  const imageSrc = `../images/${artist.id}/${motifId}.png`
  const prettyName = artist.name
  const container = document.createElement('div')
  container.classList.add('image-container', 'invisible')
  const motifImage = document.createElement('img')
  motifImage.src = imageSrc
  const motifText = document.createElement('p')
  motifText.innerText = prettyName
  container.appendChild(motifImage)
  container.appendChild(motifText)
  images.appendChild(container)
  container.onclick = makeClickHandler(imageSrc, artist)
  motifImage.onerror = () => {
    images.removeChild(container)
  }
  motifImage.onload = () => {
    container.classList.remove('invisible')
  }
}

function makeClickHandler(imageSrc, artist) {
  const clickHandler = () => {
    const image = document.createElement('img')
    image.classList.add('modal-image')
    image.src = imageSrc
    const backdrop = document.createElement('div')
    const title = document.createElement('a')
    title.classList.add('motif-title', 'fs-600')
    title.innerText = artist.name
    title.href = `../artist/index.html?artist=${artist.id}`
    backdrop.classList.add('backdrop')
    backdrop.appendChild(image)
    backdrop.appendChild(title)
    document.body.appendChild(backdrop)
    backdrop.onclick = () => document.body.removeChild(backdrop)
  }
  return clickHandler
}

window.addEventListener('scroll', function () {
  const offsetFromTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  if (window.innerWidth > 800) {
    if (offsetFromTop > 300) {
      document.getElementById('portrait').style.opacity = Math.max(
        -offsetFromTop / 400 + 7 / 4,
        0.3
      )
    } else {
      document.getElementById('portrait').style.opacity = 1
    }
  }
})

function prettyMotifName(motifId) {
  const firstLetter = motifId[0]
  const restOfName = motifId.slice(1)
  return `${firstLetter.toUpperCase()}${restOfName.replaceAll('_', ' ')}`
}
