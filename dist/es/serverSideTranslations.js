import fs from 'fs';
import path from 'path';
import { createConfig } from './config/createConfig';
import createClient from './createClient';
const DEFAULT_CONFIG_PATH = './next-i18next.config.js';
export const serverSideTranslations = async (initialLocale, namespacesRequired = [], configOverride = null) => {
  if (typeof initialLocale !== 'string') {
    throw new Error('Initial locale argument was not passed into serverSideTranslations');
  }

  let userConfig = configOverride;

  if (fs.existsSync(path.resolve(DEFAULT_CONFIG_PATH))) {
    userConfig = await import(path.resolve(DEFAULT_CONFIG_PATH));
  }

  if (userConfig === null) {
    throw new Error('next-i18next was unable to find a user config');
  }

  const config = createConfig({ ...userConfig,
    lng: initialLocale
  });
  const {
    defaultLocale,
    localeExtension,
    localePath
  } = config;
  const {
    i18n,
    initPromise
  } = createClient({ ...config,
    lng: initialLocale
  });
  await initPromise;
  const initialI18nStore = {
    [initialLocale]: {}
  };

  if (typeof config.preload === 'object' && config.preload.length > 0) {
    config.preload.forEach(_preloadLocale => {
      initialI18nStore[_preloadLocale] = {};
    });
  }

  if (typeof config.fallbackLng === 'string') {
    initialI18nStore[config.fallbackLng] = {};
  }

  if (namespacesRequired.length === 0) {
    const getAllNamespaces = path => fs.readdirSync(path).map(file => file.replace(`.${localeExtension}`, ''));

    namespacesRequired = getAllNamespaces(path.resolve(process.cwd(), `${localePath}/${defaultLocale}`));
  }

  namespacesRequired.forEach(ns => {
    for (const locale in initialI18nStore) {
      initialI18nStore[locale][ns] = (i18n.services.resourceStore.data[locale] || {})[ns] || {};
    }
  });
  return {
    _nextI18Next: {
      initialI18nStore,
      initialLocale,
      userConfig: config.serializeConfig ? userConfig : null
    }
  };
};