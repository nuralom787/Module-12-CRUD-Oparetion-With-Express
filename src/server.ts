import app from "./app";
import config from "./config";

const port = config.port;

// !  listening route.
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});