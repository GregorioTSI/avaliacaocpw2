const API_URL = 'https://api.tvmaze.com/search/shows?';
const $ = document.getElementById.bind(document);

const searchShows = (event) => {
  event.preventDefault();

  const query = $('query').value;

  if (query.trim()) {
    $('not-found-message').style.display = 'none';

    const loadingAnimation = `
      <img src="/img/loading.gif" alt="Procurando...">
    `;
    $('shows-area').innerHTML = loadingAnimation;

    fetch(API_URL + new URLSearchParams({ q: query }))
      .then((response) => response.json())
      .then((results) => {
        $('shows-area').innerHTML = '';

        if (results.length === 0) {
          console.log('Nenhum resultado');
          $('not-found-message').style.display = 'block';
          return;
        }

        results.forEach((r) => {
          const { show } = r;
          const { id, name, image } = show;

          const imageUrl = image ? image.medium : '/img/noimage.png';

          const newShow = {
            id,
            name,
            imageUrl,
          };

          printCard(newShow);
        });
      });
  }
};

const printCard = (show) => {
  const posterId = `poster-${show.id}`;
  const titleId = `title-${show.id}`;
  const bookmarkButtonId = `bookmark-${show.id}`;

  const isBookmarked = checkBookmark(show.id);

  const bookmarkButton = `
    <button class="bookmark-button" id="${bookmarkButtonId}" onclick="toggleBookmark('${show.id}')">
      ${isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
    </button>
  `;

  const showCard = `
    <div class="show-card">
      <a href="/details.html?id=${show.id}">
        <img id="${posterId}" src="${show.imageUrl}" alt="${show.name}">
      </a>

      <a href="/details.html?id=${show.id}">
        <h3 id="${titleId}">${show.name}</h3>
      </a>

      ${bookmarkButton}
    </div>
  `;

  $('shows-area').insertAdjacentHTML('beforeend', showCard);
};

const checkBookmark = (id) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  return bookmarks.some((bookmark) => bookmark.id === id);
};

const toggleBookmark = (id) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  const existingBookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id === id);

  if (existingBookmarkIndex !== -1) {
    bookmarks.splice(existingBookmarkIndex, 1);
  } else {
    bookmarks.push({ id });
  }

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

/*----------------------------------------------------------------------------------------*/
// Verifica se existem resultados da última busca armazenados no localStorage
const resultadosArmazenados = localStorage.getItem('ultimaBusca');

if (resultadosArmazenados) {
  const resultados = JSON.parse(resultadosArmazenados);

  resultados.forEach((r) => {
    const { show } = r;
    const { id, name, image } = show;

    const imageUrl = image ? image.medium : '/img/noimage.png';

    const newShow = {
      id,
      name,
      imageUrl,
    };

    printCard(newShow);
  });
}

// Adiciona o evento de busca ao formulário
const searchForm = $('search-form');
searchForm.addEventListener('submit', searchShows);
