const express = require("express");
const bookRouter = express.Router();

const bookRouterBuilder = Book => {
  bookRouter
    .route("/books")
    .post((req, resp) => {
      let book = new Book(req.body);
      book.save();
      resp.status(201).json(book);
    })
    .get((req, resp) => {
      const { query: queryString } = req;
      const query = {};
      if (queryString.genre) {
        query.genre = queryString.genre;
      }
      if (queryString.author) {
        query.author = queryString.author;
      }
      Book.find(query, (err, books) => {
        if (err) return resp.send(err);
        return resp.json(books);
      });
    });

  bookRouter.use("/books/:bookId", (req, resp, next) => {
    const { bookId } = req.params;
    Book.findById(bookId, (err, book) => {
      if (err) return resp.send(err);

      if (book) {
        req.book = book;
        return next();
      }

      return resp.sendStatus(404, `Book with ID ${bookId} was not found`);
    });
  });

  bookRouter
    .route("/books/:bookId")
    .get((req, resp) => resp.status(200).json(req.book))
    .put((req, resp) => {
      const { book } = req;
      book.title = req.body.title;
      book.read = req.body.read;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.save(err => {
        if (err) resp.send(err);
        resp.status(200).json(book);
      });
    })
    .patch((req, resp) => {
      const { book } = req;
      if (req.body._id) delete req.body._id;

      Object.entries(req.body).forEach(e => {
        book[e[0]] = e[1];
      });
      book.save(err => {
        if (err) resp.send(err);
        resp.status(200).json(book);
      });
    })
    .delete((req, resp) => {
      const { book } = req;
      book.remove(err => {
        if (err) resp.send(err);
        resp.sendStatus(202);
      });
    });

  return bookRouter;
};

module.exports = bookRouterBuilder;
