const artistsList = document.getElementById('artists-list')

fetch(`./artists.json`)
  .then((response) => response.json())
  .then(({ artists }) => {
    artists.forEach((artist) => {
      const link = document.createElement('a')
      link.innerText = artist.name
      link.href = `./artist/index.html?artist=${artist.id}`
      artistsList.appendChild(link)
    })
  })

fetch(`./motifs.json`)
  .then((response) => response.json())
  .then(({ motifs }) => {
    motifs.forEach((motif) => {
      const link = document.createElement('a')
      link.innerText = prettyMotifName(motif)
      link.href = `./motif/index.html?motif=${motif}`
      artistsList.appendChild(link)
    })
  })

function prettyMotifName(motifId) {
  const firstLetter = motifId[0]
  const restOfName = motifId.slice(1)
  return `${firstLetter.toUpperCase()}${restOfName.replaceAll('_', ' ')}`
}
