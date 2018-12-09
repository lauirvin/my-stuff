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
const items = [];
// Helmet for securing application
app.use(helmet());

// bodyParser to parse application/json content-type
app.use(bodyParser.json());

// Enable CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan("combined"));

// Retrieve all items data
app.get("/", (req, res) => {
  const qs = items.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    currency: q.currency,
    price: q.price,
    region: q.region,
    country: q.country,
    condition: q.condition,
    comments: q.comments.length,
    image: q.image.replace("public/", "")
  }));
  res.send(qs);
});

// Get a specific item
app.get("/:id", (req, res) => {
  const item = items.filter(q => q.id === parseInt(req.params.id));
  if (item.length > 1) return res.status(500).send();
  if (item.length === 0) return res.status(404).send();
  res.send(item[0]);
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

// Declare public folder as static directory
app.use(express.static("public"));

// Multer configurations
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("imageBox");

app.post("/", [checkJwt, upload], (req, res) => {
  const {
    title,
    description,
    currency,
    price,
    region,
    country,
    condition
  } = req.body;
  const newItem = {
    id: items.length + 1,
    title,
    description,
    currency,
    price,
    region,
    country,
    condition,
    image: req.file.path,
    comments: [],
    author: req.user.name
  };
  items.push(newItem);
  res.status(200).send();
});

// Insert a new comment to a item
app.post("/comment/:id", checkJwt, (req, res) => {
  const { comment } = req.body;

  const item = items.filter(q => q.id === parseInt(req.params.id));
  if (item.length > 1) return res.status(500).send();
  if (item.length === 0) return res.status(404).send();

  item[0].comments.push({
    comment,
    author: req.user.name
  });

  res.status(200).send();
});

// Start the server
app.listen(9000, () => {
  console.log("listening on port 9000");
});
