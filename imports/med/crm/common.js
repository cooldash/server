import React from 'react';
import { withRouter } from 'react-router';
import { Trans } from '@lingui/macro';
import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import { getTypeName } from '../../mods/tree';
import { addPermissions, addRoles } from '../../mods/roles';
import { Clinic, MedService } from '../clinic/model';
import { Message } from '../bot/models/message';
import { BotAction } from '../bot/models/actions';

// import { WarehouseOrder, Warehouse } from '../warehouse/model';
// import { Product, ProductCategory, ProductGroup } from '../product/model';
// import { Factory } from '../factory/model';
// import { LegalEntity } from '../users/legal-entity.model';
// import { User } from '../users/model';
// import { Payment } from '../payments/model';
// import { Message } from '../shop/message/model';
// import { SupportMessage } from '../shop/supportMessages/model';
// import { Impersonate, canImpersonate } from '../../mods/impersonate';
// import { UserCart } from '../shop/cart/model';
// import { Discount } from '../discounts/model';

addPermissions([
  'crm',
]);
addRoles({
  admin: {
    crm: true,
  },
});


export const crmTypes = [
  // { type: Payment },
  // { type: WarehouseOrder },
  // {
  //   type: UserCart,
  //   fields: {
  //     id: true,
  //     createdAt: true,
  //     partnerID: true,
  //     status: true,
  //   },
  //   details: Meteor.isClient && require('../warehouse/components/OrderDetailsCreated').CrmProductTable,
  // },
  // { type: Product },
  // { type: ProductCategory },
  // { type: ProductGroup },
  // { type: Warehouse },
  // { type: Factory },
  // { type: Discount },
  // { type: LegalEntity },
  // {
  //   type: User,
  //   fields: {
  //     id: {
  //       render: (_, user) => get(user, 'agent.partnerID'),
  //     },
  //     'emails.0.address': true,
  //     // emails: {
  //     //   resolve: emails => emails[0].address,
  //     // },
  //     profile: true,
  //     roles: true,
  //     contacts: true,
  //     delivery: true,
  //     actions: {
  //       render(_, user) {
  //         const WithRouter = withRouter(({ router }) => (
  //           <a
  //             onClick={evt => {
  //               evt.preventDefault();
  //               Impersonate.do(user._id);
  //               router.push('/shop');
  //             }}
  //             // eslint-disable-next-line no-script-url
  //             href="javascript:;"
  //           ><Trans id="impersonate.become">Become</Trans></a>
  //         ));
  //         return canImpersonate(user._id) && (<WithRouter />);
  //       },
  //     },
  //   },
  // },
  // { type: Message },
  // { type: SupportMessage },
  { type: Clinic },
  { type: MedService },
  {
    type: Message,
    fields: {
      userId: true,
      text: {
        type: String,
        optional: true,
      },
      action: {
        render(action) {
          return action ? action.type : 'null';
        },
      },
      isBot: true,
      createdAt: true,
    },
  },

];

crmTypes.forEach(({ type }) => {
  const typeName = getTypeName(type);

  addPermissions([
    `crm.${typeName}.r`,
    `crm.${typeName}.w`,
  ]);
});
