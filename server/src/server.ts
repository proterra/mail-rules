
import * as bodyParser from 'body-parser';
import * as express from 'express';
import Config from './config';

export default class RESTContainer {

  private app;

  public startServer() {

    this.app = express();

    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    this.app.use(bodyParser.json());

    this.app.use((req: express.Request, res: express.Response, next: () => void) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    this.app.post('/api/rules', (request, response) => {
      const updatedRules = JSON.stringify(request.body);
      console.log(updatedRules);
      const cfg = Config.getConfig();
      cfg.setRulesJsonString(updatedRules as string);
    });

    /**
     * Endpoint to get a JSON of all the currently defined rules
     */
    this.app.get('/api/rules', (request, response) => {
      const cfg = Config.getConfig();
      response.json(cfg.getRulesJson());
    });

    // serve static file (index.html, images, css)
    this.app.use(express.static(__dirname + '/views'));

    const port = process.env.PORT || 3000;
    return new Promise((resolve, reject) => {
      this.app.listen(port, () => {
        console.log('To view your app, open this link in your browser: http://localhost:' + port);
        resolve();
      });
    });

  }

}
