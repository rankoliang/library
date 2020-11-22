const newBookButton = document.querySelector("#new-book");
const books = document.querySelector("#books");
const progress = document.querySelector("#progress");

const library = new Library();

// Book Class

function Book(params) {
  this.title = params["title"];
  this.author = params["author"];
  this.numPages = Number(params["numPages"]);
  this.currentPage = Number(params["currentPage"]);
}

Book.prototype.progress = function () {
  return (this.currentPage * 100.0) / this.numPages;
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

Book.prototype.colors = function () {
  const breakpoints = [10, 35, 85, 100];
  const defaultColor = {
    border: "border-gray-300",
    bookmark: "text-gray-400",
  };

  const colors = [
    defaultColor,
    {
      border: "border-yellow-300",
      bookmark: "text-yellow-400",
    },
    {
      border: "border-yellow-600",
      bookmark: "text-yellow-700",
    },
    {
      border: "border-green-300",
      bookmark: "text-green-400",
    },
    {
      border: "border-green-500",
      bookmark: "text-green-700",
      book: "text-green-600",
    },
  ];

  const progress = this.progress();

  for (const [i, breakpoint] of breakpoints.entries()) {
    if (progress < breakpoint) {
      return colors[i];
    }
  }
  if (this.currentPage === this.numPages) {
    return colors[colors.length - 1];
  } else {
    return defaultColor;
  }
};

Book.prototype.image = function () {
  return `
    <svg
      class="h-48 m-auto ${this.colors()["book"]}"
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
  `;
};

Book.prototype.header = function () {
  return `
    <h2 class="text-2xl font-semibold text-gray-500 truncate lg:text-base">${this.title}</h2>
  `;
};

Book.prototype.subheader = function () {
  return `<span class="italic font-light text-gray-400 truncate lg:text-sm">${this.author}</span>`;
};

Book.prototype.buttons = function () {
  return `
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
  `;
};

Book.prototype.info = function () {
  return `
    <svg
      class="w-5 h-5 mr-1 ${this.colors()["bookmark"]}"
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
    ${this.currentPage}/${this.numPages}
  `;
};

Book.prototype.card = function () {
  return new Card(this).element;
};

// Library Class

function Library() {
  this.books = [];
}

Library.prototype.addBook = function (book) {
  this.books.push(book);
  this.updateProgress();
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
  if (this.totalPages() <= 0) {
    return 0;
  }
  return Math.round((this.pagesRead() * 100.0) / this.totalPages());
};

Library.prototype.updateProgress = function () {
  progress.textContent = `${this.progress()}%`;
};

Library.prototype.render = function () {
  // Remove all children except for the first
  while (books.childNodes.length > 2) {
    books.removeChild(books.lastChild);
  }
  for (const book of this.books) {
    books.appendChild(book.card());
  }
};

// Card class

function Card(content) {
  this.content = content;
  this.element = document.createElement("div");
  this.element.classList.add(
    "relative",
    "pb-6",
    "card",
    "border-2",
    content.colors ? content.colors()["border"] : "border-gray-300"
  );
  if (typeof this.content.template === "function") {
    this.element.innerHTML = this.content.template(this.template());
  } else {
    this.element.innerHTML = this.template();
  }
}

Card.prototype.template = function () {
  return `
    ${this.content.image()}
    ${this.content.header()}
    ${this.content.subheader()}
    <div class="absolute left-0 flex flex-row-reverse items-center justify-between w-full px-2 text-sm top-2">
      <span class="flex items-center">
        ${this.content.info()}
      </span>
      <div class="flex items-center h-auto">
        ${this.content.buttons()}
      </div>
    </div>
  `;
};

// Form class

function Form() {}

Form.prototype.colors = function () {
  return {
    border: "border-gray-500",
  };
};

Form.prototype.template = function (template) {
  return `
    <form>
      ${template}
    </form>
  `;
};

Form.prototype.configurePageFields = function (card) {
  const currentPageField = card.querySelector("#current-page");
  const numPagesField = card.querySelector("#total-pages");
  this.updateFieldWidth(currentPageField);
  this.updateFieldWidth(numPagesField);

  currentPageField.addEventListener("input", (e) => {
    this.updateFieldWidth(e.target);
  });

  numPagesField.addEventListener("input", (e) => {
    currentPageField.max = e.target.value;
    this.updateFieldWidth(e.target);
  });
};

Form.prototype.configureButtons = function (card) {
  card.querySelector("#cancel-submission").addEventListener("click", (e) => {
    e.preventDefault();
    card.remove();
  });

  card.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookParams = {};
    for (const field of e.target.querySelectorAll("input")) {
      bookParams[field.name] = field.value;
    }
    const book = new Book(bookParams);
    library.addBook(book);
    card.remove();
    library.render();
  });
};

Form.prototype.image = function () {
  return `
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
  `;
};

Form.prototype.header = function () {
  return `
      <label for="title" class="hidden">Title</label>
      <input
        type="text"
        placeholder="Title"
        class="w-full text-xl font-semibold text-center text-gray-500 lg:text-base form-field"
        id="title"
        name="title"
        required
      />
  `;
};

Form.prototype.subheader = function () {
  return `
      <label for="author" class="hidden">Author</label>
      <input
        type="text"
        placeholder="author"
        class="italic font-light text-center text-gray-400 truncate form-field lg:text-sm"
        id="author"
        name="author"
        required
      />
  `;
};

Form.prototype.info = function () {
  return `
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
        />
      </span>
  `;
};

Form.prototype.buttons = function () {
  return `
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
      </button>`;
};

Form.prototype.card = function () {
  const card = new Card(this).element;
  card.id = "new-book-form";
  this.configurePageFields(card);
  this.configureButtons(card);
  return card;
};

Form.prototype.updateFieldWidth = function (field) {
  field.style.width = `${Math.max(field.value.length + 1, 2)}ch`;
};

newBookButton.addEventListener("click", () => {
  if (document.getElementById("new-book-form")) {
    // Scrolls to the bottom of the page
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    return;
  }
  books.appendChild(new Form().card());
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

const book = new Book({
  title: "LOTR",
  author: "J.R.R. Tolkien",
  numPages: 400,
  currentPage: 400,
});
library.addBook(book);

for (let i = 0; i < 2; i++) {
  const book = new Book({
    title: "LOTR",
    author: "J.R.R. Tolkien",
    numPages: 400,
    currentPage: Math.round(Math.random() * 400),
  });
  library.addBook(book);
}

library.render();
