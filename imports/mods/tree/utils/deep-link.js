
export class DeepLink {
  static parse(link) {
    const dl = new DeepLink(link);

    const protocol = dl.findProtocol();
    const items = dl.findItems();
    const params = dl.findParams();

    return { protocol, items, params };
  }

  static build(protocol, items, params) {
    if (items.length === 0)
      return '';

    let link = protocol + '://';

    items.forEach(i => {
      link += i;
    });

    if (params.length > 0) {
      link += '?' + params.map(i => {
        const key = Object.keys(i)[0];
        return key + '=' + i[key];
      }).join('&');
    }

    return link;
  }

  constructor(link) {
    this.data = link.split('?');
  }

  findProtocol() {
    const proto = this.data[0].split('://');
    return proto[0];
  }

  findItems() {
    if (this.data.length === 0) {
      return [];
    }

    const proto = this.data[0].split('://');
    return proto[1].split('/');
  }

  findParams() {
    if (this.data.length !== 2)
      return {};

    return this.data[1].split('&').map(i => {
      const p = i.split('=');
      return { [p[0]]: p[1] };
    });
  }
}
