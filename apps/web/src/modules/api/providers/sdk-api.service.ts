import { Injectable } from '@angular/core';

@Injectable()
export class SdkApiService {

  constructor() {
  }
  /* TODO once Nest 8 released & CORS issues solved:
    import { io } from 'socket.io-client';
    const local = true;
    const url = local ? 'wss://localhost:3001' : 'wss://95aw6s98n1.execute-api.eu-west-2.amazonaws.com/dev';
    const socket = io(url);

    socket.on('connect', () => {
      console.log('CONNECTED');
    });

    socket.on('disconnect', () => {
      console.log('DISCONNECTED');
    });
  */
}
