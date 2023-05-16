const $ = document.getElementById.bind(document);

document.addEventListener('DOMContentLoaded', () => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

  if (bookmarks.length === 0) {
    $('bookmarks-area').innerHTML = '<p>No bookmarks found.</p>';
    return;
  }

  bookmarks.forEach((bookmark) => {
    fetchShowDetails(bookmark.id);
  });
});

const fetchShowDetails = (id) => {
  const API_URL = `https://api.tvmaze.com/shows/${id}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((result) => {
      const { name, image } = result;
      const imageUrl = image ? image.medium : '/img/noimage.png';

      printBookmarkCard({ id, name, imageUrl });
    });
};

const printBookmarkCard = (bookmark) => {
  const cardId = `bookmark-card-${bookmark.id}`;
  const posterId = `bookmark-poster-${bookmark.id}`;
  const titleId = `bookmark-title-${bookmark.id}`;

  const bookmarkCard = `
    <div class="bookmark-card" id="${cardId}">
      <a href="/details.html?id=${bookmark.id}">
        <img id="${posterId}" src="${bookmark.imageUrl}" alt="${bookmark.name}">
      </a>

      <a href="/details.html?id=${bookmark.id}">
        <h3 id="${titleId}">${bookmark.name}</h3>
      </a>

      <button class="remove-bookmark-button" onclick="removeBookmark('${bookmark.id}')">Remove Bookmark</button>
    </div>
  `;

  $('bookmarks-area').insertAdjacentHTML('beforeend', bookmarkCard);
};

const removeBookmark = (id) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  const bookmarkCardId = `bookmark-card-${id}`;

  const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
  localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

  const bookmarkCard = $(bookmarkCardId);
  if (bookmarkCard) {
    bookmarkCard.remove();
  }
};
