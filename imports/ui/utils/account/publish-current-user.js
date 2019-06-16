// Server
Meteor.publish('account.current', function () {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      { fields: { approved: 1 } }
    );
  } else {
    this.ready();
  }
});
