/**
 * Created by kriz on 09/02/2019.
 */

import React from 'react';
import { LocaleProvider as AntdLocaleProvider } from 'antd';
import { I18nProvider } from '@lingui/react';

import ruRU from 'antd/lib/locale-provider/ru_RU';
import enUS from 'antd/lib/locale-provider/en_US';

import { i18n } from './index';

const LocaleProvider = ({ children }) => (
  <AntdLocaleProvider locale={ruRU}>
    <I18nProvider i18n={i18n} >
      {children}
    </I18nProvider>
  </AntdLocaleProvider>
);

export default LocaleProvider;
