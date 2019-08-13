'use strict';
const pkg = require('./package.json');

module.exports = {
    root: './docs',
    title: 'back-book',
    // Enforce use of GitBook v3
    gitbook: '^3.2.2',

    // Use the "officical theme"
    plugins: ['theme-officical@2.1.1', '-sharing', '-fontsettings', 'sitemap'],

    variables: {
      version: pkg.version,
    },
    pluginsConfig: {
      sitemap: {
        hostname: 'https://toolchain.gitbook.com',
      }
    }
}
