import React from 'react';
import map from 'lodash/map';

// import { Class } from 'meteor/jagi:astronomy';

import { types } from '../../base/type-db';
import renderMeta from '../render-meta';
// import { NamedNode } from '../../../mods/types/named-node/NamedNode.meta';

// class BasicSelect extends React.Component {
//   render() {
//     const { value, defaultValue, options, innerLabel, ...rest } = this.props;
//     return (
//       <Select value={value} defaultValue={defaultValue} {...rest}>
//         {options.map((opt) => {
//           let val: any = opt;
//           let lab = opt;
//           if (typeof opt === 'object') {
//             val = opt.value;
//             lab = opt.label;
//           }
//           return (<Select.Option key={val} value={val}>
//             {innerLabel && (value || defaultValue) === val}{lab}
//           </Select.Option>);
//         })}
//       </Select>
//     );
//   }
// }

// const MetaAddType = Class.create({
//   name: 'MetaAddForm',
//   fields: {
//     metaType: {
//       label: 'Meta type',
//       type: String,
//       form: {
//         attrs: {
//           options: Object.keys(types),
//         },
//         component: BasicSelect,
//       },
//     },
//   },
// });

export default class MetaAdd extends React.PureComponent {
  render() {
    const { node } = this.props;
    return renderMeta({
      node,
      context: 'addmeta layout',
      type: NamedNode.getName(),
      def: () => 'NO LAYOUT FOUND',
      children: map(types, type =>
        type.getName && renderMeta({ key: type.getName(), context: 'addmeta', node, type: type.getName(), def: null })),
    });
  }
}
