export const EventCallback = (data, callback) => {
  const { e, doc, old } = data;
  callback[e](doc, old);
};

export class EventBuilder {
  _params = {};

  static added(params) {
    const e = new EventBuilder('added');
    e.params(params);
    return e.build();
  }

  static changed(params) {
    const e = new EventBuilder('changed');
    e.params(params);
    return e.build();
  }

  static removed(params) {
    const e = new EventBuilder('removed');
    e.params(params);
    return e.build();
  }

  static apply = EventCallback;

  static isEvent(data) {
    return 'doc' in data;
  }

  constructor(e) {
    this._params = { e };
  }

  params = params => {
    this._params = { ...this._params, ...params };
    return this;
  };

  build = () => {
    const func = callback => {
      EventCallback(this._params, callback);
    };

    func.map = (newDoc, newOld = d => d) => {
      const { doc, old } = this._params;

      if (typeof newDoc === 'function')
        this._params.doc = newDoc(doc);
      else
        this._params.doc = newDoc;

      if (old) {
        if (typeof newOld === 'function')
          this._params.old = newOld(old);
        else
          this._params.old = newOld;
      }

      return func;
    };

    func.getDoc = () => {
      return this._params.doc;
    };

    func.getOld = () => {
      return this._params.old;
    };

    func.getEvent = () => {
      return this._params.e;
    };

    // Event is a function, to send data use getParams method
    func.getParams = () => {
      return this._params;
    };

    return func;
  };
}
