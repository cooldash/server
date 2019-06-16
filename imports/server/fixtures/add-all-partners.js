import parseCsv from 'csv-parse/lib/sync';
import { get, groupBy, map } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';
import { User } from '../../utils/user.model';
import DaData, { ddToAddress } from '../../utils/dadata';
import { Address } from '../../imperial/common/address.model';
import { sendEmailSync } from '../email';

export default function () {
  User.remove({ 'emails.address': '2910545@mail.ru' });

  const dadata = new DaData({ token: get(Meteor.settings, 'public.dadata.token', '4fa891c9a9814ac057cfca8234ae0e499da38ce4') });

  const partners = parseCsv(Assets.getText('partners.csv'), {
    columns: true,
    // raw: true,
  });
  const byMail = groupBy(partners.filter(p => p.email), p => p.email);

  Promise.seq(map(byMail, (pp, email) => async () => {
    const password = Random._randomString(8, '0123456789');
    const main = pp[0];

    const userId = Accounts.createUser({ email, password });
    const user = User.findOne(userId);
    user.roles.push('reg-partner');

    // fix name
    const data = await dadata.suggestions('fio', main.name, { count: 1 });
    if (data[0]) {
      const nameInfo = data[0].data;
      user.profile.firstName = nameInfo.name;
      user.profile.lastName = nameInfo.surname;
    }

    user.contacts.telegram = main.telegram;

    await Promise.all(pp.slice(0, 1).map(async p => {
      const data = await dadata.suggestions('address', p.region, { count: 1 });
      const address = ddToAddress(data[0].data);
      user.delivery.deliveryAddresses.push(address);
    }));

    user.save();

//     sendEmail({
//       subject: 'Corvus приглашает в приложение',
//       text: `Заходите в кабинет по ссылке ${Meteor.absoluteUrl()}
// Вам присвоены следующие данные для входа:
// Логин: ${email}
// Пароль: ${password}
//
// C уважением,
// Команда Corvus.
//
// `,
//       to: email,
//     });

  }));
}

