/**
 * Created by kriz on 13/01/16.
 */
import { Migrations } from 'meteor/percolate:migrations';
import { UserCart } from '../../imperial/shop/cart/model';
import { SalesModelCol } from '../../imperial/sales/model';

// see https://github.com/percolatestudio/meteor-migrations for details
Migrations.add({
  version: 3,
  name: 'Add codes to user carts',
  up() {
    SalesModelCol.find({}).forEach(s => {
      UserCart.update(
        { id: s.cartID, 'productList.productID': s.productID },
        { $set: { 'productList.$.codes': s.codes } },
      );
    });
  },
  down() {},
});
