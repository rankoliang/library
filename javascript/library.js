function Book(
  title = "Placeholder",
  author = "Placeholder",
  numPages = Math.round(Math.random() * 200),
  currentPage = 0
) {
  this.title = title;
  this.author = author;
  this.numPages = numPages;
  this.currentPage = currentPage;
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

