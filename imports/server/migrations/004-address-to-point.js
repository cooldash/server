/**
 * Created by kriz on 13/01/16.
 */
import { Migrations } from 'meteor/percolate:migrations';
import { UserCart } from '../../imperial/shop/cart/model';
import { User } from '../../imperial/users/model';

// see https://github.com/percolatestudio/meteor-migrations for details
Migrations.add({
  version: 4,
  name: 'Add codes to user carts',
  up() {
    UserCart.find({ 'delivery.deliveryAddress': { $exists: true } }).forEach(cart => {
      UserCart.update(
        { id: cart.id },
        {
          $set: { 'delivery.deliveryPoint': { address: cart.delivery.deliveryAddress } },
          $unset: { 'delivery.deliveryAddress': 1 },
        },
      );
    });
    User.find({ 'delivery.deliveryAddresses': { $exists: true } }).forEach(user => {
      User.update(
        user._id,
        {
          $set: {
            'delivery.points': user.delivery.deliveryAddresses.map(address => ({ address })),
          },
        },
      );
    });
  },
  down() {},
});
