module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
    },
  },
  pwa: {
    name: 'Vuesic Cloud',
    themeColor: '#3b82f6',
    manifestOptions: {
      short_name: 'Vuesic Cloud',
    },
  },
};
