const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) =>
    res.sendFile(path.join(__dirname, "public", "index.html")),
);
app.get("/students", (_, res) =>
    res.sendFile(path.join(__dirname, "public", "students.html")),
);
app.get("/courses", (_, res) =>
    res.sendFile(path.join(__dirname, "public", "courses.html")),
);
app.get("/services", (_, res) =>
    res.sendFile(path.join(__dirname, "public", "services.html")),
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`\n🖥️  Frontend → http://localhost:${PORT}`);
    console.log(
        `   API Gateway: ${process.env.API_GATEWAY_URL || "http://localhost:3000"}\n`,
    );
});
