require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dataService = require("./services/dataServices");
const app = express();
const jwt = require("jsonwebtoken");
const PORT= process.env.PORT

app.use(
  cors()
);
app.use(express.json());
app.listen( PORT || 7000, () => {
  console.log("cart app listening at port number :",PORT ||7000);
});


// application specific middleware
const appMiddleware = (req, res, next) => {
  console.log("inside application middleware");
  next();
};

app.use(appMiddleware);

// food-app front end request resolving

//token verify middleware
const jwtMiddleware = (req, res, next) => {
  console.log("inside router specific middleware");
  //get token from req headers
  const token = req.headers["access-token"];
  console.log(token);
  try {
    //verify token
    const data = jwt.verify(token, "B68DC6BECCF4A68C3D8D78FE742E2");
    req.email = data.email;
    console.log("valid token");
    next();
  } catch {
    console.log("invalid token");
    res.status(401).json({
      message: "Please Login!",
    });
  }
};

//register api call
app.post("/register", (req, res) => {
  console.log("inside register api");
  console.log(req.body);
  //async
  dataService
    .register(req.body.username, req.body.email, req.body.password)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//login api call
app.post("/login", (req, res) => {
  console.log("inside login api");
  console.log(req.body);
  //async
  dataService.login(req.body.email, req.body.password).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// all products api
app.get("/all-products", (req, res) => {
  dataService.allProducts().then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// view product api
app.get("/view-product/:productId", (req, res) => {
  dataService.viewProduct(req.params.productId).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// add to wishlist a  product jwtmiddleare used to verify token during login
app.post("/addToWishlist", jwtMiddleware, (req, res) => {
  console.log("inside addtowishlist api");
  //async
  dataService
    .addToWishlist(req.body.email, req.body.productId)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// wishlist a  product jwtmiddleare used to verify token during login
app.put("/removeFromWishlist", jwtMiddleware, (req, res) => {
  console.log("inside removeFromWishlist api");
  //async
  dataService
    .removeFromWishlist(req.body.email, req.body.productId)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//  addToCart
app.post("/addToCart", jwtMiddleware, (req, res) => {
  console.log("inside addToCart api");
  //async
  dataService
    .addToCart(req.body.email, req.body.productId, req.body.count)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// removeFromCart
app.put("/removeFromCart", jwtMiddleware, (req, res) => {
  console.log("inside removeFromWishlist api");
  //async
  dataService
    .removeFromCart(req.body.email, req.body.productId)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// removeFromCart
app.put("/updateCartItemCount", jwtMiddleware, (req, res) => {
  console.log("inside updateCartItemCount api");
  //async
  dataService
    .updateCartItemCount(req.body.email, req.body.productId, req.body.count)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});
// emptyCart
app.put("/emptyCart", jwtMiddleware, (req, res) => {
  console.log("inside emptyCart api");
  //async
  dataService.emptyCart(req.body.email).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// get myitems cart after login  from user profile api
app.get("/getWishlist/:email", jwtMiddleware, (req, res) => {
  dataService.getWishlist(req.params.email).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// get my order cart after login  from user profile api
app.get("/getMyOrders/:email", jwtMiddleware, (req, res) => {
  dataService.getMyOrders(req.params.email).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// add to Checkout a  transcation jwtmiddleare used to verify token during login
app.post("/addToCheckout", jwtMiddleware, (req, res) => {
  console.log("inside addToCheckout api");
  //async
  dataService
    .addToCheckout(
      req.body.email,
      req.body.orderID,
      req.body.transactionID,
      req.body.dateAndTime,
      req.body.amount,
      req.body.status,
      req.body.products,
      req.body.detailes
    )
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

module.exports = app;
