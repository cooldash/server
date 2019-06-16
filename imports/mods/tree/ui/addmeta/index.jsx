/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

import React from 'react';
import { Random } from 'meteor/random';
import { Cascader, Icon } from 'antd';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import reduce from 'lodash/reduce';
import last from 'lodash/last';

import { addComponent } from '../../base/type-db';
import { NamedNode } from '../../../mods/types/named-node/NamedNode.meta';
import { metaData } from './create';

class AddMetaToolbar extends React.PureComponent {
  constructor(props) {
    super(props);

    const createSkeleton = (data, menu, items) => {
      const item = items.shift();

      if (!menu)
        menu = {};

      if (!item) {
        if (!menu.__data__)
          menu.__data__ = [];

        menu.__data__.push(data);

        return menu;
      }

      menu[item] = createSkeleton(data, menu[item], items);

      return menu;
    };

    const createMenu = skeleton => {
      return flatten(map(skeleton, (item, key) => {
        if (key === '__data__') {
          return (item.length === 1) ? item[0] : item;
        }

        return {
          value: key,
          label: key,
          children: createMenu(item),
        };
      }));
    };

    const skeleton = reduce(metaData, function (res, data, typeName) {
      const items = data.path.split('/');

      if (!items) {
        return res;
      }

      const label = data.type.icon
        ? <span><Icon type={data.type.icon} theme="outlined" />{data.label}</span>
        : data.label;

      const _data = { value: typeName, label };
      res = createSkeleton(_data, res, items);
      return res;
    }, {});

    this.options = createMenu(skeleton);
  }

  onClick = value => {
    const { type, onCreated } = metaData[last(value)];
    const { node } = this.props;
    const meta = node.addMeta(type, {});
    if (onCreated) onCreated(meta);
    node.save();
  };

  render() {
    return (
      <Cascader
        options={this.options}
        onChange={this.onClick}
      >
        <a className="ant-dropdown-link" href="#">
          <Icon type="plus" /> Add component <Icon type="down" />
        </a>
      </Cascader>
    );
  }
}

addComponent(AddMetaToolbar, NamedNode, 'addmeta layout');
