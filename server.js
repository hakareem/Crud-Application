const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const connectedString =
  "mongodb+srv://delz:M2waR52VveEkJ8R6@cluster0.e7pehh7.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connectedString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("CONNTECTED TO DB");
    const db = client.db("star-wars");
    const quotesCollection = db.collection("quotes");

    // Middlewares
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));

    //routes
    app.get("/", (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.render("index.ejs", { quotes: results });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((res) => {
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => res.json("Success"))
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Deleted Darth Vadar's quote");
        })
        .catch((error) => console.error(error));
    });

    app.listen(3000, () => {
      console.log("listening on 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
