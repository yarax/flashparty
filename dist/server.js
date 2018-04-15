"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./controllers/party");
require("./controllers/spot");
const bodyParser = require("body-parser");
const express = require("express");
const methodOverride = require("method-override");
const routes_1 = require("./routes");
const app = express();
app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendFile(__dirname + '/swagger.json');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
routes_1.RegisterRoutes(app);
app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        res.json({
            error: err.message
        });
    }
});
/* tslint:disable-next-line */
console.log('Starting server on port 3000...');
app.listen(3000);
//# sourceMappingURL=server.js.map