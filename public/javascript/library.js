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
  // returns an svg of a book
  return createSVG(
    ["h-48", "m-auto", this.colors()["book"]],
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  );
};

Book.prototype.header = function () {
  const header = document.createElement("h2");
  header.classList.add("text-2xl", "font-semibold", "text-gray-500", "truncate", "lg-text-base");
  header.textContent = this.title;
  return header;
};

Book.prototype.subheader = function () {
  const subheader = document.createElement("span");
  subheader.classList.add("italic", "font-light", "text-gray-400", "truncate", "lg:text-sm");
  subheader.textContent = this.author;
  return subheader;
};

Book.prototype.buttons = function () {
  const buttons = document.createElement("div");
  buttons.classList.add("flex", "items-center", "h-auto");
  const editButton = document.createElement("button");
  editButton.classList.add("edit-book", "hover:text-black", "focus:outline-none", "focus:text-black");
  const editButtonIcon = createSVG(
    ["w-4", "h-4"],
    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
  );
  editButton.appendChild(editButtonIcon);
  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "delete-book",
    "ml-1",
    "text-red-400",
    "hover:text-red-600",
    "focus:outline-none",
    "focus:text-text-red-600"
  );
  const trashIcon = createSVG(
    ["w-4", "h-4"],
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  );
  deleteButton.appendChild(trashIcon);
  buttons.appendChild(editButton);
  buttons.appendChild(deleteButton);

  return buttons;
};

Book.prototype.info = function () {
  const info = document.createElement("span");
  info.classList.add("flex", "items-center");

  info.appendChild(
    createSVG(
      ["w-5", "h-5", "mr-1", this.colors()["bookmark"]],
      "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    )
  );

  const progress = document.createElement("span");
  progress.textContent = `${this.currentPage}/${this.numPages}`;

  info.appendChild(progress);
  return info;
};

Book.prototype.card = function (index) {
  const card = new Card(this).element;
  if (!isNaN(index)) {
    card.dataset.cardIndex = index;
  }
  return card;
};

Book.prototype.postInitializeCard = function (card) {
  card.querySelector(".delete-book").addEventListener("click", () => {
    if (!confirm(`Are you sure you want to delete ${this.title}?`)) {
      return;
    }
    library.books.splice(card.dataset.cardIndex, 1);
    library.render();
  });

  card.querySelector(".edit-book").addEventListener("click", () => {
    const edit_form = new Form({
      title: this.title,
      author: this.author,
      currentPage: this.currentPage,
      numPages: this.numPages,
    });

    edit_form.configureButtons = function (card) {
      card.querySelector("#cancel-submission").addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("You will lose your form progress. Are you sure?")) {
          library.render();
        }
      });

      card.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        for (const field of e.target.querySelectorAll("input")) {
          library.books[card.dataset.cardIndex][field.name] = isNaN(field.value) ? field.value : Number(field.value);
        }
        localStorage.books = JSON.stringify(library.books);
        library.render();
      });
    };
    if (document.getElementById("new-book-form")) {
      document.getElementById("new-book-form").remove();
    }
    books.insertBefore(edit_form.card(card.dataset.cardIndex), card);
    card.remove();
  });
};

// Library Class

function Library() {
  if (localStorage.getItem("books")) {
    this.books = JSON.parse(localStorage.books).map((book_params) => new Book(book_params));
  } else {
    this.books = [];
  }
}

Library.prototype.addBook = function (book) {
  this.books.push(book);
  localStorage.books = JSON.stringify(this.books);
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
  return Math.floor((this.pagesRead() * 100.0) / this.totalPages());
};

Library.prototype.updateProgress = function () {
  progress.textContent = `${this.progress()}%`;
};

Library.prototype.render = function () {
  // Remove all children except for the first
  while (books.childNodes.length > 2) {
    books.removeChild(books.lastChild);
  }
  for (const [i, book] of this.books.entries()) {
    books.appendChild(book.card(i));
  }
  this.updateProgress();
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
  this.init();
  this.content.postInitializeCard && this.content.postInitializeCard(this.element);
}

Card.prototype.init = function () {
  this.element.appendChild(this.content.image());
  this.element.appendChild(this.content.header());
  this.element.appendChild(this.content.subheader());

  const topContainer = document.createElement("div");
  topContainer.classList.add(
    "absolute",
    "left-0",
    "flex",
    "flex-row-reverse",
    "items-center",
    "justify-between",
    "w-full",
    "px-2",
    "text-sm",
    "top-2"
  );
  this.element.appendChild(topContainer);

  topContainer.appendChild(this.content.info());

  topContainer.appendChild(this.content.buttons());

  return this.element;
};

// Form class

function Form(values) {
  this.values = Object.assign(
    {
      title: "",
      author: "",
      currentPage: 0,
      numPages: 1,
    },
    values
  );
}

Form.prototype.colors = function () {
  return {
    border: "border-gray-500",
  };
};

Form.prototype.configurePageFields = function (card) {
  const currentPageField = card.querySelector("#current-page");
  const numPagesField = card.querySelector("#total-pages");
  currentPageField.max = numPagesField.value;
  this.updateFieldWidth(currentPageField);
  this.updateFieldWidth(numPagesField);

  currentPageField.addEventListener("input", (e) => {
    this.updateFieldWidth(e.target);
  });

  numPagesField.addEventListener("input", (e) => {
    currentPageField.max = e.target.value;
    this.updateFieldWidth(e.target);
  });

  [currentPageField, numPagesField].forEach((field) => {
    field.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.target.blur();
      }
    });
  });
};

Form.prototype.configureButtons = function (card) {
  card.querySelector("#cancel-submission").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("You will lose your form progress. Are you sure?")) {
      card.remove();
    }
  });

  card.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookParams = {};
    for (const field of e.target.querySelectorAll("input")) {
      bookParams[field.name] = isNaN(field.value) ? field.value : Number(field.value);
    }
    const book = new Book(bookParams);
    library.addBook(book);
    card.remove();
    library.render();
  });
};

Form.prototype.image = function () {
  // returns an svg of a book
  return createSVG(
    ["h-48", "m-auto"],
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  );
};
Form.prototype.image = function () {
  return createSVG(
    ["h-48", "m-auto"],
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  );
};

Form.prototype.header = function () {
  const header = document.createElement("div");
  const label = document.createElement("label");
  label.setAttribute("for", "title");
  label.classList.add("hidden");
  label.textContent = "Title";

  header.appendChild(label);

  const headerField = document.createElement("input");
  headerField.type = "text";
  headerField.placeholder = "Title";
  headerField.id = "title";
  headerField.name = "title";
  headerField.value = this.values.title;
  headerField.required = true;
  headerField.classList.add(
    "w-full",
    "text-xl",
    "font-semibold",
    "text-center",
    "text-gray-500",
    "lg:text-base",
    "form-field"
  );

  header.appendChild(headerField);

  return header;
};

Form.prototype.subheader = function () {
  const subheader = document.createElement("div");
  const label = document.createElement("label");
  label.setAttribute("for", "author");
  label.classList.add("hidden");
  label.textContent = "Author";

  subheader.appendChild(label);

  const headerField = document.createElement("input");
  headerField.type = "text";
  headerField.placeholder = "Author";
  headerField.id = "author";
  headerField.name = "author";
  headerField.value = this.values.author;
  headerField.required = true;
  headerField.classList.add(
    "italic",
    "font-light",
    "text-center",
    "text-gray-400",
    "truncate",
    "form-field",
    "lg:text-sm"
  );

  subheader.appendChild(headerField);

  return subheader;
};

Form.prototype.info = function () {
  const info = document.createElement("span");
  info.classList.add("flex", "items-center");
  const currentPageField = field({
    id: "current-page",
    name: "currentPage",
    labelContent: "Current page",
    inputClasses: ["w-12", "text-center", "form-field"],
    placeholder: "Author",
    value: this.values.currentPage,
  });

  info.appendChild(currentPageField);
  info.appendChild(document.createTextNode("/"));

  const totalPageField = field({
    id: "total-pages",
    name: "numPages",
    labelContent: "Current page",
    inputClasses: ["w-12", "mr-1", "text-center", "form-field"],
    value: this.values.numPages,
  });

  info.appendChild(totalPageField);

  return info;
};

Form.prototype.buttons = function () {
  const buttons = document.createElement("div");
  buttons.classList.add("flex", "items-center", "h-auto");

  const submitBook = document.createElement("button");
  submitBook.classList.add(
    "text-green-400",
    "cursor-pointer",
    "hover:text-green-600",
    "focus:text-green-600",
    "focus:outline-none"
  );
  submitBook.id = "submit-book";
  submitBook.appendChild(createSVG(["w-5", "h-5"], "M5 13l4 4L19 7"));

  const cancelSubmission = document.createElement("button");
  cancelSubmission.classList.add("text-red-400", "focus:outline-none", "focus:text-red-600", "hover:text-red-600");
  cancelSubmission.id = "cancel-submission";
  cancelSubmission.appendChild(createSVG(["w-5", "h-5"], "M6 18L18 6M6 6l12 12"));

  buttons.appendChild(submitBook);
  buttons.appendChild(cancelSubmission);

  return buttons;
};

Form.prototype.card = function (index) {
  const form_card = new Card(this).element;
  if (!isNaN(index)) {
    form_card.dataset.cardIndex = index;
  }

  return form_card;
};

Form.prototype.postInitializeCard = function (card) {
  card.id = "new-book-form";
  const formWrapper = document.createElement("form");
  while (card.childNodes.length > 0) {
    const node = card.firstElementChild;
    formWrapper.appendChild(node);
  }
  card.appendChild(formWrapper);
  this.configurePageFields(card);
  this.configureButtons(card);
};

Form.prototype.updateFieldWidth = function (field) {
  field.style.width = `${Math.max(field.value.length + 1, 2)}ch`;
};

function createSVG(classList, pathCommands) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(...classList);
  console.log(svg.classList);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgPath.setAttribute("stroke-linecap", "round");
  svgPath.setAttribute("stroke-linejoin", "round");
  svgPath.setAttribute("stroke-width", "2");
  svgPath.setAttribute("d", pathCommands);

  svg.appendChild(svgPath);

  return svg;
}

function field(params) {
  const fieldContainer = document.createElement("div");

  const label = document.createElement("label");
  label.setAttribute("for", params.id);
  label.classList.add("hidden");
  label.textContent = params.labelContent;

  const field = document.createElement("input");
  field.type = "text";
  field.name = params.name;
  field.id = params.id;
  field.required = true;
  field.placeholder = params.placeholder;
  field.value = params.value;

  field.classList.add(...params.inputClasses);
  fieldContainer.appendChild(label);
  fieldContainer.appendChild(field);
  return fieldContainer;
}

newBookButton.addEventListener("click", () => {
  if (document.getElementById("new-book-form")) {
    // Scrolls to the bottom of the page
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    return;
  }
  books.appendChild(new Form().card());
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

library.render();
