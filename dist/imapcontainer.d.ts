/// <reference types="node" />
import { EventEmitter } from 'events';
export default class IMAPContainer extends EventEmitter {
    private client;
    private mailboxName;
    /**
     *
     */
    constructor();
    connect(mailboxName: string): Promise<void>;
    move(msg: any, dest: any): Promise<void>;
}
