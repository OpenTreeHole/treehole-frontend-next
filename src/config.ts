import * as pksjson from '../package.json'

const baseUrl = import.meta.env.BASE_URL

const config = {
  // Basic info
  feRepository: 'https://www.github.com/OpenTreeHole/treehole-frontend-next',
  teamHomepage: 'https://www.github.com/OpenTreeHole',
  teamMail: 'danxi_dev@protonmail.com',
  latestReleasePkgJSON:
    'https://cdn.jsdelivr.net/gh/OpenTreeHole/treehole-frontend-next@master/package.json', // the latest version number of front end.
  feVersion: pksjson.version,

  backEndUrl: import.meta.env.VITE_BACKEND_URL,
  authUrl: import.meta.env.VITE_AUTH_URL,
  authBaseUrl: import.meta.env.VITE_AUTH_BASE_URL,
  cookieDomain: import.meta.env.VITE_COOKIE_DOMAIN,

  // licenses
  licenses: [
    {
      name: '社区公约',
      type: 'pdf',
      link: `${baseUrl}licenses/fduhole-norms.pdf`
    },
    {
      name: '使用条款',
      type: 'markdown',
      link: `${baseUrl}licenses/terms-of-use.md`
    },
    {
      name: '隐私政策',
      type: 'markdown',
      link: `${baseUrl}licenses/privacy-policy.md`
    },
    {
      name: '开源协议',
      type: 'markdown',
      link: `${baseUrl}licenses/open-source-licenses.md`
    }
  ],
  friendLinks: [
    {
      siteName: '旦夕 App',
      author: 'DanXi-Dev',
      link: 'https://danxi-dev.github.io'
    }
  ]
}

export default config
