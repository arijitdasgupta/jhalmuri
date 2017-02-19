import * as express from 'express';

import {IApplication} from '../interfaces/IApplication';


export class StaticApplication implements IApplication {
    public app;

    constructor() {
        this.app = express();

        this.app.use('/assets', express.static('./assets'));
    }
}