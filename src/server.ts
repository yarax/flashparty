import './controllers/party';
import './controllers/spot';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as methodOverride from 'method-override';
import { RegisterRoutes } from './routes';

const app = express();

app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendFile(__dirname + '/swagger.json');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

RegisterRoutes(app);

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