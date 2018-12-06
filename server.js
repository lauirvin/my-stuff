const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const path = require("path");
const multer = require("multer");

const app = express();

// Define array where data will be stored
const recipes = [];
const images = [];

// Helmet for securing application
app.use(helmet());

// bodyParser to parse application/json content-type
app.use(bodyParser.json());

// Enable CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan("combined"));

// Retrieve image data
app.get("/upload", (req, res) => {
  const is = images.map(q => ({
    id: q.id,
    file: q.file
  }));
  console.log(is);
  res.send(is);
});

// Retrieve all recipes data
app.get("/", (req, res) => {
  const qs = recipes.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    ingredients: q.ingredients,
    comments: q.comments.length
  }));
  res.send(qs);
});

// Get a specific recipe
app.get("/:id", (req, res) => {
  const recipe = recipes.filter(q => q.id === parseInt(req.params.id));
  if (recipe.length > 1) return res.status(500).send();
  if (recipe.length === 0) return res.status(404).send();
  res.send(recipe[0]);
});

// Get a specific image
app.get("/upload/:id", (req, res) => {
  const image = images.filter(q => q.id === parseInt(req.params.id));
  if (image.length > 1) return res.status(500).send();
  if (image.length === 0) return res.status(404).send();
  res.send(image[0]);
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://lauirvin.eu.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: "VrJTIwBiRdwPHLAxhh1pnQugG0kf13VC",
  issuer: `https://lauirvin.eu.auth0.com/`,
  algorithms: ["RS256"]
});

app.use(express.static("public"));

// Insert new image
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

app.post("/upload", upload, (req, res) => {
  const newImage = {
    id: recipes.length + 1,
    file: req.file.path
  };
  images.push(newImage);
  res.status(200).send();
  console.log(newImage);
});

// Insert a new recipe
app.post("/", checkJwt, (req, res) => {
  const { title, description, ingredients } = req.body;
  const newRecipe = {
    id: recipes.length + 1,
    title,
    description,
    ingredients,
    comments: [],
    author: req.user.name
  };
  recipes.push(newRecipe);
  res.status(200).send();
});

// Insert a new comment to a recipe
app.post("/comment/:id", checkJwt, (req, res) => {
  const { comment } = req.body;

  const recipe = recipes.filter(q => q.id === parseInt(req.params.id));
  if (recipe.length > 1) return res.status(500).send();
  if (recipe.length === 0) return res.status(404).send();

  recipe[0].comments.push({
    comment,
    author: req.user.name
  });

  res.status(200).send();
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Start the server
app.listen(8081, () => {
  console.log("listening on port 8081");
});
