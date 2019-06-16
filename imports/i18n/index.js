import { setupI18n } from '@lingui/core';

import moment from 'moment';
import 'moment/locale/ru';

import messagesEn from '../locales/en/messages';
import messagesRu from '../locales/ru/messages';

export { saveCollected } from './patch-astronomy';

export const i18n = setupI18n({
  catalogs: { ru: messagesRu, en: messagesEn },
});

export const setLanguage = lang => {
  moment.locale(lang);
  i18n.activate(lang);
};

export const T = i18n._.bind(i18n);
export const P = i18n.pluralForm.bind(i18n);

setLanguage('ru');


// ////////////////////////////////////////////////////////////////////////////
// // OLD STUFF
// ////////////////////////////////////////////////////////////////////////////
import get from 'lodash/get';
// import ruRU  from './ru';
const ruRU_ = {};

const replaceReg = /\{(\w+)\}/g;

const getMessage = id => (ruRU_[id] || get(ruRU_, id));

export function formatMessage({ id, defaultMessage }, values) {
  if (typeof values === 'string') {
    defaultMessage = values;
    values = null;
  }

  let string = getMessage(id) || defaultMessage || id;
  if (values) {
    string = string.replace(replaceReg, val => {
      return values[val.slice(1, -1)] || '';
    });
  }

  return string;
}

export const FormattedMessage = formatMessage;

export const t = (id, values) => formatMessage({ id }, values);

export function setLocale() {};
export function getLocale() {};

