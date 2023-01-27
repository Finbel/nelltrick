fetch(`../artists.json`)
  .then((response) => response.json())
  .then(({ artists }) => {
    artists.forEach((artist) => {
      const link = document.createElement("a");
      link.innerText = artist.name;
      link.href = `/artist/index.html?artist=${artist.id}`;
      document.body.appendChild(link);
    });
  });
