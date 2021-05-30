/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Oblong',
  tagline: 'Developer First UI Framework',
  url: 'https://oblong.travislwatson.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'travislwatson',
  projectName: 'oblong',
  themeConfig: {
    navbar: {
      title: 'Oblong',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'quick-start',
          position: 'left',
          label: 'Quick Start',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/travislwatson/oblong',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Quick Start',
              to: '/docs/Quick Start',
            },
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/oblong',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/travislwatson/oblong',
            },
          ],
        },
      ],
      copyright: `Oblong and Website Contents Copyright © ${new Date().getFullYear()} Travis Watson. Site built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/travislwatson/oblong/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/travislwatson/oblong/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
