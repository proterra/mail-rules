/*
    Copyright 2018,2019 Matthew B White

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import * as Cloudant from '@cloudant/cloudant';
import { EventEmitter } from 'events';
import Config from './config';

export default class CloudantContainer extends EventEmitter {

    private cloudant;
    private mydb;

    public constructor() {
        super();
        const cfg = Config.getConfig();
        const dbName = 'mail-rules';
        // tslint:disable-next-line:max-line-length
        const url = cfg.$cloudantUrl;
        this.cloudant = Cloudant(url);
        this.mydb = this.cloudant.db.use(dbName);
    }

    public async addEmail(email, action) {
        const id = `${email.uid}`;
        const body = await this.mydb.insert({ email, action }, id);
    }
}
