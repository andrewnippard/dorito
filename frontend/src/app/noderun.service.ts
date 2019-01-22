import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { map } from 'rxjs/operators';

const NODE_RUN_URL = 'ws://localhost:8000/calc/ws/calc/node_run_';

export interface Message {
  node_run: number,
  status: string
}

@Injectable()
export class NodeRunService {
	public messages: Subject<Message>;
  public node_run_id = 90;

	constructor(wsService: WebsocketService) {
		this.messages = <Subject<Message>>wsService
			.connect(NODE_RUN_URL + this.node_run_id.toString())
			.pipe(
        map((response: MessageEvent): Message => {
          let data = JSON.parse(response.data);
          return {
            node_run: data.node_run,
            status: data.status
          }
        })
      );
	}
}