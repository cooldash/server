import { Meteor } from 'meteor/meteor';

import { BaseServiceComponent } from '../../services/base-service.server';
import { addComponent } from '../..';
import { TestServiceMeta } from './test.meta';
import { addType } from '../../base/type-db';

// @component(TestServiceMeta)
export class TestService extends BaseServiceComponent {
  inputMsgs = [];
  outputMsgs = [];

  didInit({ input, output, both, statedInput }) {
    input.subscribe(
      msg => {
        // console.log('input MSG received', msg.data, 'from', msg.fromID);
        this.inputMsgs.push(msg);
      },
      null,
      () => {
        console.log('SOCKET closed');
      },
    );
    output.onConnect((socket, msg) => {
      this.outputMsgs.push(msg);
      // console.log('SOCKET connected to output', msg && msg.data, socket.id);
      socket.send(`some default data in reply to '${msg && msg.data}'`);
    });
    output.subscribe(msg => {
      this.outputMsgs.push(msg);
      msg.socket.send(`reply: ${msg.data}`);
    });
    statedInput.subscribe(
      msg => {
        // console.log('input MSG received', msg.data, 'from', msg.fromID);
        this.inputMsgs.push(msg);
      },
      null,
      () => {
        console.log('SOCKET closed');
      },
    );
    // both.subscribe(msg => {
    //   Meteor.setTimeout(() => {
    //     if (msg.data === 'ping')
    //       msg.socket.send('pong');
    //     else
    //       msg.socket.send('ping');
    //   }, 1000);
    //   console.log(msg.data);
    // });
  }
}

addComponent(TestService, TestServiceMeta, 'service');
addType(TestServiceMeta);
