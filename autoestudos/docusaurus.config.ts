import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Autoestudos',
  tagline: 'Plataforma de Autoestudos',
  favicon: 'img/logobranca.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://inteliacademyclub.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/autoestudos/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'inteliacademyclub', // Usually your GitHub org/user name.
  projectName: 'autoestudos', // Usually your repo name.

  onBrokenLinks: 'throw',

  // O conteúdo é todo em português: isso ajusta o <html lang> e os textos da
  // interface ("Próximo", "Anterior", títulos das admonitions etc.).
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  markdown: {
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['pt', 'en'],
        docsRouteBasePath: '/',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  plugins: ['docusaurus-plugin-image-zoom'],

  clientModules: ['./src/clientModules/semTransicaoNoTema.ts'],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.47/dist/katex.min.css',
      type: 'text/css',
      crossorigin: 'anonymous',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve the docs at the site's root
          // "R$ 10 ... R$ 20" não deve virar fórmula: só $$...$$ e $...$ sem espaço
          remarkPlugins: [[remarkMath, {singleDollarTextMath: false}]],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: ['./src/css/custom.css', './src/css/excalifont.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Logo',
        src: 'img/logoazul.png',
        srcDark: 'img/logobranca.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'autoestudosSidebar',
          position: 'left',
          label: 'Autoestudos',
        },
        {
          type: 'html',
          position: 'right',
          value: '<img src="/autoestudos/img/mascote.png" alt="Mascote Inteli Academy" style="height: 40px; margin-right: 0px; margin-top: 5px; border-radius: 50%;" />',
        },
        {
          href: 'https://github.com/inteliacademyclub/autoestudos',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Trilhas',
          items: [
            {label: 'ML Preditivo e Agentes', to: '/aulas/ml-preditivo-e-agentes'},
            {label: 'Eval-Driven Development', to: '/aulas/eval-driven-development/introducao-ao-eval-driven-development'},
          ],
        },
        {
          title: 'Projetos',
          items: [{label: 'Case Galaxies', to: '/projetos/galaxies'}],
        },
        {
          title: 'Comunidade',
          items: [{label: 'GitHub', href: 'https://github.com/inteliacademyclub/autoestudos'}],
        },
      ],
      copyright: `Inteli Academy · ${new Date().getFullYear()}`,
    },

    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
      options: {
        look: 'handDrawn',
        handDrawnSeed: 42,
        fontFamily: 'Excalifont, "Comic Sans MS", cursive',
      },
    },

    zoom: {
      // não dar zoom em imagens que são links (badges) nem nos diagramas interativos
      selector: '.markdown img:not(a img)',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(17, 17, 22)',
      },
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'json', 'toml', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
