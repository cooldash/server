/* eslint-disable no-trailing-spaces,max-len */

// Clients:
// - Subscribe to Array (children, news, etc) - add/change/remove/error - package(data)
// - Subscribe to Value change (field, state) - add/change/error - package(data)
// - Call method and subscribe to result (Call form, method) - add/change/error - package(data + state + progress)
// - Just connect and start to receive data (empty subscribe) - add/error - package(data)

// Servers:
// Send changes of array
// Send value and update it
// Return method result (maybe update progress)
// Send changes after connect

// *add = multiple adds allowed
// Request + Content                                        Updates                        Update content
// - Subscribe to List (filter, sort, limit)                - *add/change/remove/error     - package(data)
// - Subscribe to Value change ()                           - add/change/error             - package(data)
// - Call method and subscribe to result (method arguments) - add/change/error             - package(data + state + progress)
// - Just connect to Stream and start to receive data ()    - *add/error                   - package(data)

// Client - Server
// ==================
// RAW - ????
// Method - Field = field as result to method call
// Method - List = get one result and close
// Method - Method = ok method call
// Method - Stream = get one result and close

// List - Field = one-element-list with value
// List - Method = one-element-list with result
// List - List = ok, updated list
// List - Stream = always growing list - bad

// Field - Field = ok field value updated
// Field - Method = error on bad params / method value as field value
// Field - List = bad situation, many adds
// Field - Stream = bad situation, will add many values

// Stream - Field - get one and updates
// Stream - Method - get partial results and final result
// Stream - List - get all list elements and updates
// Stream - Stream - ok, get streamed elements

// Port type for client startup
// Method - nothing, waiting for client to call
// List - subscribe with given args, or empty args
// Field - subscribe with given args, or empty args
// Stream - subscribe with given args, or empty args

// Port type for server startup
// Stream - auto init, just send data
// Method - nothing, waiting for client to call
// List - subscribe with given args, or empty args
// Field - subscribe with given args, or empty args

const Port = null;
const OutStreamPort = null;
const OutListPort = null;
const OutMethodPort = null;

const InStreamPort = null;
const InMethodPort = null;
const InListPort = null;
const InValuePort = null;

const Meta = null;

///////////////////////
const ServerServiceMeta = Meta.inherit({
  name: 'meta-server-service',
  fields: {
    stream: {
      type: OutStreamPort,
      ns: Port.NS.Server,
    },
    foo: {
      type: String,
    },
    list: {
      type: OutListPort,
      ns: Port.NS.Server,
    },
    method: {
      type: OutMethodPort,
      ns: Port.NS.Server,
    },
  },
});

class ServerService {
  didInit({ stream, list, method }) {
    // stream - NOP
    list.onSubscibe(this.onListSubscribe);
    method.onCall(this.onMethodCall);
  }

  someStreamMethod() {
    this.props.stream.send({ foo: 'somedata' });
  }

  someFooMethod() {
    // new value will be sent to client
    this.meta.foo = 20;
    this.save();
  }

  onListSubscribe = (params, handler) => {
    handler.add(1, { bar: 'bar' });
    handler.add(2, { bar: 'baz' });
    handler.change(2, { bar: 'bazzzzz' });

    handler.onClose(() => {});
    handler.close();
  };

  onMethodCall = async (params, handler) => {
    // do some work based on params
    if (!params.foo)
      throw new Error('bad method params');

    handler.setProgress(10);

    return { bar: 'some-method-result' };
  };

  onMethodCallRaw = (params, handler) => {
    const id = params.callId;
    const methodHandler = {
      ...handler,
      setProgress(p) { handler.change(id, null, { progress: p }); },
    };
    try {
      handler.add(id, null, { state: 'started', progress: 0 });
      const result = this.onMethodCall(params.data, methodHandler);
      handler.change(id, result, { state: 'finished' });
      handler.close();
    } catch (err) {
      handler.error(id, err);
    }
  }
}

const ServiceWithPorts = withPorts({
  method: 'onMethodCall',
  list: 'onListSubscribe',
})(ServerService);

/////////////////////////////////////////////////////////////

const ServerClientMeta = Meta.inherit({
  name: 'meta-server-client',
  fields: {
    input: {
      type: InStreamPort,
      ns: Port.NS.Server,
    },
    methodClient: {
      type: InMethodPort,
      ns: Port.NS.Server,
    },
    listClient: {
      type: InListPort,
      ns: Port.NS.Server,
      // defined in DB with edit context
      initParams: {
        filter: {
          age: { $gt: 25 },
        },
        sort: { createdAt: -1 },
        limit: 5,
      },
    },

    clientFoo: {
      type: String,
    },

    clientInputValue: {
      type: InValuePort,
      ns: Port.NS.Server,
    },
  },
});

class ServerClient {
  didUpdate(oldProps) {
    if (this.props.clientFoo !== oldProps.clientFoo) {
      // ....
    }
  }

  didInit({ input, listClient, params, clientInputValue }) {
    // case 0 - we do nothing, port itself sends first data
    listClient.current.onList(list => {
      // do something with list
      console.log('list updated', list);
    });

    // case 1 - we need full list update
    const sub1 = listClient.subscribe(params);
    sub1.onList(list => {
      // do something with list
      console.log('list updated', list);
    });

    // case 2 - we need partial updates
    const sub2 = listClient.subscribe(params);
    sub2.onChange({
      added() {},
      changed() {},
      removed() {},
    });

    clientInputValue.onChange(value => {
      // do something with new value,
    });

    // case 3 check if subscribed or subscribe
    const sub3 = listClient.current || listClient.subscribe(params);
    sub3.onList(list => {});
  }

  onStreamData(msg) {
    // process data
  }

  async someMethodMethod(params) {
    const result = await this.props.methodClient.call(params);
    console.log('result');
  }
}

const ClientWithPorts = withPorts({
  input: 'onStreamData',
})(ServerClient);


//
// Client subscribe with params -> server recv params, reply with stream.
