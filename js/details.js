const $ = document.getElementById.bind(document);

const API_URL = 'https://api.tvmaze.com/shows';

const search = window.location.search;
const params = new URLSearchParams(search);
const id = params.get('id');
console.log(id);

fetch(`${API_URL}/${id}`)
  .then((response) => response.json())
  .then((result) => {
    const { name, type, language, genres, status, image, network, webChannel } =
      result;

    const running = status === 'Ended' ? false : true;
    const imageUrl = image ? image.medium : '/img/noimage.png';
    const channel = network ? network.name : webChannel?.name || 'Unknown';

    $('poster').src = imageUrl;
    $('name').innerText = name;
    $('type').innerText = type;
    $('language').innerText = language;
    $('genres').innerText = genres.join(', ');
    $('running').innerText = running ? 'Sim' : 'Não';
    $('channel').innerText = channel;
  })
  .catch((error) => {
    console.log('Error fetching show details:', error);
    $('poster').src = '/img/noimage.png';
  });

const toggleBookmark = (id) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

  const bookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id === id);
  if (bookmarkIndex !== -1) {
    // Se o show já estiver favoritado, remova-o
    bookmarks.splice(bookmarkIndex, 1);
    $(`bookmark-button-${id}`).innerText = 'Bookmark';
  } else {
    // Se o show não estiver favoritado, adiciona-lo
    const bookmark = { id };
    bookmarks.push(bookmark);
    $(`bookmark-button-${id}`).innerText = 'Remove Bookmark';
  }

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};
