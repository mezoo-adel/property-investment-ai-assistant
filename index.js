require("dotenv/config");
require("module-alias/register");

const express = require("express");
const mongoose = require("mongoose");
const webRoutes = require("@/routes/web");
const apiRoutes = require("@/routes/api");
const corsMiddleware = require("@/middleware/corsMiddleware");
const loggerMiddleware = require("@/middleware/loggerMiddleware");
const { fullPath } = require("@/utils/fileSystem");
const dbConnect = require("@/config/dbConnection");

dbConnect();
const app = express();
const PORT = process.env.NODE_PORT;

app.use(corsMiddleware);
app.use(loggerMiddleware);

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", webRoutes);
app.use("/api", apiRoutes);

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({
      error: "Not Found",
      message: `API endpoint ${req.method} ${req.path} not found`,
    });
  } else {
    // Root level 404 - serve the 404 HTML page
    res.status(404).sendFile(fullPath("views", "404.html"));
  }
});

mongoose.connection.on("error", (error) => console.error(error));
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
