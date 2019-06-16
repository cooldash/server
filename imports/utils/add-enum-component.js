import { t } from '@lingui/macro';
import { T } from '../i18n';
import { addComponent } from '../mods/tree';
import { createEnumSelector } from '../mods/form/fields';

export const addEnumComponent = astonomyEnum => {
  addComponent(({ value }) => T(value || t`undefined`), astonomyEnum, 'react');
  addComponent(({ value }) => T(value || t`undefined`), astonomyEnum, 'react cell');
  addComponent(createEnumSelector(astonomyEnum), astonomyEnum, 'react form');
};
