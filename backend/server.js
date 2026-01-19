const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", require("./routes/products"));
app.use("/vendors", require("./routes/vendors"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
app.use("/discover", require("./routes/discover"));

app.use("/search", require("./routes/search"));
