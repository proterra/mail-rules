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

import * as jsome from 'jsome';
import { Engine } from 'json-rules-engine';
import IMAPContainer from './imapcontainer';

const rules = [
    {
        conditions: {
            any: [
                {
                    fact: 'msg',
                    operator: 'equal',
                    path: '.envelope.sender[0].address',
                    value: 'email_relay@freecycle.org',
                },
            ],
        },
        event: {  // define the event to fire when the conditions evaluate truthy
            params: {
                dest: 'freecycle',
            },
            type: 'move',
        },
    },
    {
        conditions: {
            any: [
                {
                    fact: 'msg',
                    operator: 'equal',
                    path: '.envelope.sender[0].address',
                    value: 'weewx-user@googlegroups.com',
                },
            ],
        },
        event: {  // define the event to fire when the conditions evaluate truthy
            params: {
                dest: 'Weewx',
            },
            type: 'move',
        },
    },
];

// initialize with options
const options = {
    allowUndefinedFacts: true,
};

const imap = new IMAPContainer();

const mailEventFn = async (msg) => {
    const engine = new Engine(rules, options);
    engine.on('success', async (event) => {

        const action = event.type;
        if (action === 'move') {
            const destination = event.params.dest;
            await imap.move(msg, destination);
        } else {
            // unknown
            throw new Error(`Unknown action ${action}`);
        }

    });
    const results = await engine.run({ msg });
    jsome(msg);
};

imap.on('exists', mailEventFn);
imap.on('fetch', mailEventFn);

imap.connect('INBOX');
