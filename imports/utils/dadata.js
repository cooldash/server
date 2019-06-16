import { map } from 'lodash';
import { Address } from '../imperial/common/address.model';

if (Meteor.isServer)
  XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

export default class DaData {
  constructor({ token }) {
    this.token = token;
  }

  load = (url, options) => {
    if (this.prom) {
      this.prom.abort();
    }

    const xhr = new XMLHttpRequest();

    this.prom = new Promise((res, rej) => {
      const headers = {
        Accept: 'application/json',
        Authorization: `Token ${this.token}`,
        'Content-Type': 'application/json',
      };
      if (options.apiKey) {
        headers['X-Secret'] = options.apiKey;
      }

      xhr.open('POST', url);
      map(headers, (v, k) => xhr.setRequestHeader(k, v));
      xhr.send(options.body);

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4 || xhr.status === 0) {
          return;
        }

        if (xhr.status === 200) {
          res(JSON.parse(xhr.response || xhr.responseText));
        } else {
          rej(new Error(`dadata: ${xhr.status}`));
        }
      };
    });

    this.prom.abort = xhr.abort.bind(xhr);

    return this.prom;
  };

  suggestions = (type, query, { count = 5, ...options } = {}) => {
    return this.load(
      `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${type}`,
      {
        ...options,
        body: JSON.stringify({ query, count }),
      },
    )
      .then(response => response && response.suggestions.map(s => {
        s.text = s.value;
        return s;
      }));
  };
  clean = (type, body, options) => {
    return this.load(
      `https://dadata.ru/api/v2/clean/${type}`,
      {
        ...options,
        body,
      },
    );
    // .then(response => response && response.suggestions.map(s => {
    //   s.text = s.value;
    //   return s;
    // }));
  };
}

export const ddToAddress = s => new Address({
  country: s.country,
  region: s.region_with_type,
  city: s.city_with_type || `${s.area_with_type}, ${s.settlement_with_type}`,
  street: `${s.street_with_type || ''} ${s.house ? `${s.house_type} ${s.house}` : ''} ${
    s.block ? `${s.block_type} ${s.block}` : ''}`,
});

