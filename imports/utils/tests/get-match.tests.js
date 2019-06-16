import { expect } from 'chai';
import getMatch from '../get-match';


describe('getMatch', () => {
  it('get id from email', () => {
    const messageId = '<01010165aec750a0-89f88a08-d099-4f4d-b0cc-8f9cb0d1933c-000000@us-west-2.amazonses.com>';
    const id = getMatch(/^<((-?[\w]+){1,3}).*$/, messageId);

    expect(id).to.equal('01010165aec750a0-89f88a08-d099');
  });
  it('get id from email 1-20', () => {
    const messageId = '<01010165aec750a0-89f88a08-d099-4f4d-b0cc-8f9cb0d1933c-000000@us-west-2.amazonses.com>';
    const id = getMatch(/^<([\w]{1,20}).*$/, messageId);

    expect(id).to.equal('01010165aec750a0');
  });
});
