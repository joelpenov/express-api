const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 3030;
const Book = require("./data/models/Book");
const path = require("path");
const username = "c8cba876-0ee0-4-231-b9ee";
const pass =
  "FFuyIN2uv0eZ3M6pQEl7dE3yDDL5YuEweyoSrOid4CLyT1UtyIzEqO7iiIDSyDbcxskzL1VrsVe8lorCr9Rhag==";
const server = "c8cba876-0ee0-4-231-b9ee.documents.azure.com";
const dbPort = 10255;
const dbName = "bookdb";

const bookDb = mongoose.connect(
  `mongodb://${username}:${pass}@${server}:${dbPort}/${dbName}`,
  { useNewUrlParser: true, ssl: true }
);

const app = express();
const appRouter = express.Router();

appRouter.route("/books").get((req, resp) => {
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

appRouter.route("/books/:bookId").get((req, resp) => {
  const { bookId } = req.params;
  Book.findById(bookId, (err, book) => {
    if (err) return resp.send(err);
    return resp.json(book);
  });
});

app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(port, () =>
  console.log(`Server listening on port ${port}: http://localhost:${port}`)
);
