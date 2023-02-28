const title = document.getElementById('title')
const text = document.getElementById('text')
const portrait = document.getElementById('portrait')
const images = document.getElementById('images')

const params = new URL(document.location).searchParams
const artistId = params.get('artist')

portrait.src = `../images/${artistId}/bg.png`

fetch(`../artists.json`)
  .then((response) => response.json())
  .then(({ artists }) => {
    const artist = artists.find(
      (artist) => artist.id === artistId.toLocaleLowerCase()
    )

    // Set the artist title
    title.innerText = artist.name
    if (artist.name.length > 15) {
      title.classList.remove('fs-800')
      title.classList.add('fs-700')
    }

    // Write the artist description
    artist.description.forEach((paragraph) => {
      const p = text.appendChild(document.createElement('p'))
      p.innerText = paragraph
    })

    // Add artist image alt text
    portrait.alt = `Portrait by ${artist.name} --ar 2:3`

    // Now we need to fetch all the motifs
    fetch(`../motifs.json`)
      .then((response) => response.json())
      .then(({ motifs }) => {
        // For each motif we append an image with text
        motifs.forEach((motif) => appendMotifImage(images, artistId, motif))
      })
  })
  .catch((error) => console.log(error))

function appendMotifImage(images, artistId, motifId) {
  const imageSrc = `../images/${artistId}/${motifId}.png`
  const prettyName = prettyMotifName(motifId)
  const container = document.createElement('div')
  container.classList.add('image-container', 'invisible')
  const motifImage = document.createElement('img')
  motifImage.src = imageSrc
  const motifText = document.createElement('p')
  motifText.innerText = prettyName
  container.appendChild(motifImage)
  container.appendChild(motifText)
  images.appendChild(container)
  container.onclick = makeClickHandler(imageSrc, motifId)
  motifImage.onerror = () => {
    images.removeChild(container)
  }
  motifImage.onload = () => {
    container.classList.remove('invisible')
  }
}

function makeClickHandler(imageSrc, motifId) {
  const clickHandler = () => {
    const image = document.createElement('img')
    image.classList.add('modal-image')
    image.src = imageSrc
    const backdrop = document.createElement('div')
    const title = document.createElement('a')
    title.innerText = prettyMotifName(motifId)
    title.classList.add('motif-title', 'fs-600')
    title.href = `../motif/index.html?motif=${motifId}`
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
