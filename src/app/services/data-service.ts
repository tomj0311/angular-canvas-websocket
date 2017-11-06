import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketService } from './web-socket.service';

const CHAT_URL = 'ws://localhost:8999/';

export interface RequestData {
	FromDate: string;
	ToDate: string;
	Randomize: number;
}

export interface ResponseData {
	DateTime: Date;
	Randomized: number;
}

@Injectable()
export class DataService {

	public messages: Subject<RequestData>;

	constructor(wsService: WebSocketService) {
		this.messages = <Subject<RequestData>>wsService
			.connect(CHAT_URL)
			.map((response: MessageEvent): RequestData => {
        let data = JSON.parse(response.data);
        return data;
				//return {
        //  DateTime: data.DateTime,
				//	Randomized: data.Randomized
				// }
			});
	}
}