/**
 * Created by kriz on 01/04/2019.
 */
import React from 'react';
import { Button } from 'antd';
import { Meteor } from 'meteor/meteor';
import { Trans } from '@lingui/macro';

import { withRouter } from 'react-router';
import { useTracker } from '../../../ui/utils/useTracker';
import { Impersonate } from '../../../mods/impersonate';
import styles from './MainLayout.module.less';

const unimpersonate = (router) => {
  Impersonate.undo();
  router.push('/crm/user');
};

const StopImpersonating = withRouter(({ router, user }) => {
  return (
    <div className={styles.unimpContainer}>
      <div className={styles.email}>{user.emails[0].address} {user.profile.firstName} {user.profile.lastName}</div>
      <Button onClick={() => unimpersonate(router)}><Trans id="unimpersonate" /></Button>
    </div>
  );
});

const MainLayout = ({ children }) => {
  const imp = useTracker(() => ({
    active: Impersonate.isActive(),
    user: Meteor.user(),
  }));

  if (imp.active) {
    return (
      <div>
        <StopImpersonating user={imp.user} />
        {children}
      </div>
    );
  } else {
    return children;
  }

};

export default MainLayout;
