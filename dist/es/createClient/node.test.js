import createClientNode from './node';
const config = {
  defaultLocale: 'en',
  locales: ['en', 'de'],
  use: []
};
describe('createClientNode', () => {
  const client = createClientNode(config);
  it('returns a node client', () => {
    expect(typeof client.initPromise.then).toEqual('function');
    expect(typeof client.i18n.addResource).toEqual('function');
    expect(typeof client.i18n.translator).toEqual('object');
    expect(client.i18n.options.defaultLocale).toEqual(config.defaultLocale);
    expect(client.i18n.options.locales).toEqual(config.locales);
    expect(client.i18n.options.isClone).not.toEqual(true);
  });
  describe('createClientNode a second time should return a clone of i18next', () => {
    it('returns a node client', () => {
      const secondClient = createClientNode(config);
      expect(typeof secondClient.initPromise.then).toEqual('function');
      expect(typeof secondClient.i18n.addResource).toEqual('function');
      expect(typeof secondClient.i18n.translator).toEqual('object');
      expect(secondClient.i18n.options.defaultLocale).toEqual(config.defaultLocale);
      expect(secondClient.i18n.options.locales).toEqual(config.locales);
      expect(secondClient.i18n.options.isClone).toEqual(true);
      expect(secondClient).not.toEqual(client);
      expect(secondClient.store).toEqual(client.store);
    });
  });
});