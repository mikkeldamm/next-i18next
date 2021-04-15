import React from 'react';
import fs from 'fs';
import { screen, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { appWithTranslation } from './appWithTranslation';
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn()
}));

const DummyI18nextProvider = ({
  children
}) => /*#__PURE__*/React.createElement(React.Fragment, null, children);

jest.mock('react-i18next', () => ({
  I18nextProvider: jest.fn(),
  __esmodule: true
}));
const DummyApp = appWithTranslation(() => /*#__PURE__*/React.createElement("div", null, "Hello world"));
const props = {
  pageProps: {
    _nextI18Next: {
      initialLocale: 'en',
      userConfig: {
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'de']
        }
      }
    }
  }
};

const renderComponent = () => render( /*#__PURE__*/React.createElement(DummyApp, props));

describe('appWithTranslation', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([]);
    I18nextProvider.mockImplementation(DummyI18nextProvider);
  });
  afterEach(jest.resetAllMocks);
  it('returns children', () => {
    renderComponent();
    expect(screen.getByText('Hello world')).toBeTruthy();
  });
  it('respects configOverride', () => {
    const DummyAppConfigOverride = appWithTranslation(() => /*#__PURE__*/React.createElement("div", null, "Hello world"), {
      configOverride: 'custom-value',
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'de']
      }
    });
    const customProps = {
      pageProps: {
        _nextI18Next: {
          initialLocale: 'en'
        }
      }
    };
    render( /*#__PURE__*/React.createElement(DummyAppConfigOverride, customProps));
    const [args] = I18nextProvider.mock.calls;
    expect(screen.getByText('Hello world')).toBeTruthy();
    expect(args[0].i18n.options.configOverride).toBe('custom-value');
  });
  it('throws an error if userConfig and configOverride are both missing', () => {
    const DummyAppConfigOverride = appWithTranslation(() => /*#__PURE__*/React.createElement("div", null, "Hello world"));
    const customProps = {
      pageProps: {
        _nextI18Next: {
          initialLocale: 'en',
          userConfig: null
        }
      }
    };
    expect(() => render( /*#__PURE__*/React.createElement(DummyAppConfigOverride, customProps))).toThrow('appWithTranslation was called without a next-i18next config');
  });
  it('returns an I18nextProvider', () => {
    renderComponent();
    expect(I18nextProvider).toHaveBeenCalledTimes(1);
    const [args] = I18nextProvider.mock.calls;
    expect(I18nextProvider).toHaveBeenCalledTimes(1);
    expect(args).toHaveLength(2);
    expect(args[0].children).toBeTruthy();
    expect(args[0].i18n.addResource).toBeTruthy();
    expect(args[0].i18n.language).toEqual('en');
    expect(args[0].i18n.isInitialized).toEqual(true);
    expect(fs.existsSync).toHaveBeenCalledTimes(0);
    expect(fs.readdirSync).toHaveBeenCalledTimes(0);
  });
});