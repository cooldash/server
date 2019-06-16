/**
 * Created by kriz on 15/04/2018.
 */

import React from 'react';
import { Tooltip } from 'antd';

import { addComponent } from '../../base/type-db';
import { getTypeName } from '../../base/get-type-name';

export const metaData = {};

export const createAddMeta = (type, path, label, onCreated) => {
  const typeName = getTypeName(type);
  metaData[typeName] = { path, label, onCreated, type };
  addComponent(({ node }) => {
    if (!label) {
      label = path;
      path = 'other';
    }

    const onClick = () => {
      const meta = node.addMeta(type, {});
      if (onCreated) onCreated(meta);
      node.save();
    };

    return (
      <Tooltip title={typeName}>
      <span
        onClick={onClick}
        onKeyPress={onClick}
      >
        {label} ({typeName})
      </span>
      </Tooltip>
    );
  }, type, 'addmeta');
};

export default createAddMeta;
