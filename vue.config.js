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
		name: 'Milo Music',
		themeColor: '#3b82f6',
		manifestOptions: {
			short_name: 'Milo Music',
		},
	},
};
