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

import axios from 'axios';
import { EventEmitter } from 'events';
import Config from './config';

export default class TodoistContainer extends EventEmitter {

    private url: string = 'https://beta.todoist.com/API/v8/tasks';
    private cfg;

    public constructor() {
        super();
        this.cfg = Config.getConfig();

    }

    public async addTodo(email, details) {
        const data = {
            content: email.envelope.subject,
            due_lang: 'en',
            due_string: 'tomorrow',
            priority: 4,
        };

        let response = await axios.post(this.url, data, {
            headers: {
                Authorization: `Bearer ${this.cfg.$todoistToken}`,
                'Content-Type': 'application/json',
                'X-Request-Id': `${email.uid}`,
            },
        });

        if (response.status === 200) {

        }
    }
}
