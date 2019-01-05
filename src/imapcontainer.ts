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

import ImapClient from 'emailjs-imap-client';
import { EventEmitter } from 'events';
import Config from './config';

import { emit } from 'cluster';
import * as jsome from 'jsome';

export default class IMAPContainer extends EventEmitter {
    private client: ImapClient;
    private mailboxName: string;

    /**
     *
     */
    public constructor() {
        super();
        const cfg = Config.getConfig();

        this.client = new ImapClient(cfg.getServer(), 993, {
            auth: {
                pass: cfg.getPassword(),
                user: cfg.getUserid(),
            },
            requireTLS: true,
            useSecureTransport: true,
        });

        this.client.onerror = (error) => {
            console.log(error);
            process.exit(-1);
        };
    }

    public async connect(mailboxName: string) {
        this.mailboxName = mailboxName;
        await this.client.connect();
        const mailbox = await this.client.selectMailbox(mailboxName);
        jsome(mailbox);

        this.client.onupdate = (path, type, value) => {
            if (type === 'expunge') {
                console.log(`Expunge ${value}, ${path}`);
                // untagged EXPUNGE response, e.g. "* EXPUNGE 123"
                // value is the sequence number of the deleted
                // message prior to deletion, so adapt your cache accordingly
            } else if (type === 'exists') {

                // untagged EXISTS response, e.g. "* EXISTS 123"
                // value is new EXISTS message count in the selected mailbox
                this.client.listMessages(mailboxName, value, ['uid', 'flags', 'envelope']).then(async (messages) => {
                    messages.forEach(async (message) => {
                        console.log('emitting exists');
                        this.emit('exists', message);

                    });
                });
            } else if (type === 'fetch') {
                this.client.listMessages(mailboxName, value['#'],
                    ['uid', 'flags', 'envelope']).then(async (messages) => {
                        messages.forEach(async (message) => {
                            console.log('emitting fetch');
                            this.emit('fetch', message);
                        });
                    });
                // untagged FETCH response, e.g. "* 123 FETCH (FLAGS (\Seen))"
                // add a considerable amount of input tolerance here!
                // probably some flag updates, a message or messages have been altered in some way
                // UID is probably not listed, probably includes only the sequence number `#` and `flags` array
            }
        };
    }

    public async move(msg, dest) {
        console.log(this.mailboxName, msg.uid, dest, { byUid: true });
        await this.client.moveMessages(this.mailboxName, msg.uid, dest, { byUid: true });
    }
}
