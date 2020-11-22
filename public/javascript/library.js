function Book(params) {
  this.title = params["title"];
  this.author = params["author"];
  this.numPages = Number(params["numPages"]);
  this.currentPage = Number(params["currentPage"]);
}

Book.prototype.progress = function () {
  return ((this.currentPage * 100.0) / this.numPages).toFixed(2);
};

Book.prototype.updateProgress = function (pagesRead) {
  this.currentPage = pagesRead;
};

Book.prototype.finish = function () {
  this.updateProgress(this.numPages);
};

Book.prototype.reset = function () {
  this.updateProgress(0);
};

Book.prototype.read = function () {
  return this.currentPage === this.numPages;
};

Book.prototype.cardHTML = function (colors) {
  colors = Object.assign(
    {
      border: "border-gray-300",
      bookmark: "text-gray-400",
      book: "",
    },
    colors
  );
  const book_card = document.createElement("div");
  book_card.classList.add("relative", "pb-6", colors["border"], "card");
  book_card.innerHTML = `
          <svg
            class="h-48 m-auto ${colors["book"]}"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h2 class="text-2xl font-semibold text-gray-500 truncate lg:text-base">${this.title}</h2>
          <span class="italic font-light text-gray-400 truncate lg:text-sm">${this.author}</span>
          <div class="absolute left-0 flex justify-between w-full px-2 text-sm top-2">
            <div class="flex items-center">
              <button class="hover:text-black focus:outline-none focus:text-black">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button class="ml-1 text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
            <span class="flex items-center">
              <svg
                class="w-5 h-5 mr-1 ${colors["bookmark"]}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              ${this.currentPage}/${this.numPages}</span
            >
          </div>
`;
  return book_card;
};

function Library() {
  this.books = [];
}

Library.prototype.addBook = function (book) {
  this.books.push(book);
};

Library.prototype.booksRead = function () {
  return this.books.reduce((booksRead, book) => {
    return booksRead + Number(book.read());
  }, 0);
};

Library.prototype.pagesRead = function () {
  return this.books.reduce((pagesRead, book) => {
    return pagesRead + book.currentPage;
  }, 0);
};

Library.prototype.totalPages = function () {
  return this.books.reduce((totalPages, book) => {
    return totalPages + book.numPages;
  }, 0);
};

Library.prototype.progress = function () {
  return ((this.pagesRead() * 100.0) / this.totalPages()).toFixed(2);
};

const newBookButton = document.querySelector("#new-book");
const books = document.querySelector("#books");
const library = new Library();

const newForm = () => {
  if (document.getElementById("new-book-form")) {
    return;
  }
  const form_card = document.createElement("div");
  form_card.classList.add("relative", "pb-6", "border-gray-300", "card");
  form_card.innerHTML = `
    <form>
        <svg
          class="h-48 m-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <label for="title" class="hidden">Title</label>
        <input
          type="text"
          placeholder="Title"
          class="w-full text-xl font-semibold text-center text-gray-500 lg:text-base form-field"
          id="title"
          name="title"
          required
        />
        <label for="author" class="hidden">Author</label>
        <input
          type="text"
          placeholder="author"
          class="italic font-light text-center text-gray-400 truncate form-field lg:text-sm"
          id="author"
          name="author"
          required
        />
        <div class="absolute left-0 flex flex-row-reverse items-center justify-between w-full px-2 text-sm top-2">
          <span class="flex items-center">
            <label for="current-page" class="hidden">Current page</label>
            <input type="number" min="0" class="w-12 text-center form-field" id="current-page" value="0" name="currentPage"/>
            <label for="total-pages" class="hidden">Total pages</label>
            /<input
              type="number"
              min="1"
              class="w-12 mr-1 text-center form-field"
              id="total-pages"
              name="numPages"
              value="1"
            />pages
          </span>
          <div class="flex items-center h-auto">
            <button
              class="text-green-400 cursor-pointer hover:text-green-600 focus:text-green-600 focus:outline-none"
              id="submit-book"
              >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
            <button class="text-red-400 focus:outline-none focus:text-red-600 hover:text-red-600" id="cancel-submission">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </form>`;
  const currentPageField = form_card.querySelector("#current-page");
  const numPagesField = form_card.querySelector("#total-pages");
  updateFieldWidth(currentPageField);
  updateFieldWidth(numPagesField);

  currentPageField.addEventListener("input", (e) => {
    updateFieldWidth(e.target);
  });

  numPagesField.addEventListener("input", (e) => {
    currentPageField.max = e.target.value;
    updateFieldWidth(e.target);
  });

  form_card.querySelector("#current-page").addEventListener;
  form_card.querySelector("#cancel-submission").addEventListener("click", (e) => {
    e.preventDefault();
    form_card.remove();
  });

  form_card.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookParams = {};
    for (const field of form_card.querySelectorAll("input")) {
      bookParams[field.name] = field.value;
    }
    const book = new Book(bookParams);
    library.addBook(book);
    form_card.remove();
    books.appendChild(book.cardHTML());
  });
  form_card.id = "new-book-form";
  books.appendChild(form_card);
};

function updateFieldWidth(field) {
  field.style.width = `${Math.max(field.value.length + 1, 2)}ch`;
}

newBookButton.addEventListener("click", newForm);
