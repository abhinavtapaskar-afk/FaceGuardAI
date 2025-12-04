const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// just a simple homepage
app.get("/", (req, res) => {
  res.send("FaceGuard AI is running 🚀");
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
