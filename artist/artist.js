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
    const artist = artists.find((artist) => artist.id === artistId)

    // Set the artist title
    title.innerText = artist.name

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

function appendMotifImage(images, artistId, motif) {
  const container = document.createElement('div')
  container.classList.add('image-container', 'invisible')
  const motifImage = document.createElement('img')
  const motifText = document.createElement('p')
  motifText.innerText = motif.prettyName
  container.appendChild(motifImage)
  container.appendChild(motifText)
  images.appendChild(container)
  motifImage.src = `../images/${artistId}/${motif.id}.png`
  motifImage.onerror = () => {
    images.removeChild(container)
  }
  motifImage.onload = () => {
    container.classList.remove('invisible')
  }
}
