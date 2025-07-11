# IPM Package Release Notes Reader

A static single-page application for viewing IPM package release notes.

## Features

- View package release notes from the IPM Hub feed
- Support for both RSS and JSON formats
- Track recently viewed packages
- Direct linking to specific package feeds
- Dark/light theme support
- Responsive design for mobile and desktop
- PWA support for offline usage

## Development

### Local Development

To run this application locally:

1. Clone the repository
2. Open index.html in a browser or use a local server:
   ```
   npx http-server -c-1
   ```

### Handling CORS Issues in Development

The application makes API calls to `https://feed.ipmhub.io`. When developing locally, you might encounter CORS (Cross-Origin Resource Sharing) restrictions. The application includes a fallback mechanism that uses a CORS proxy, but here are additional options:

#### Option 1: Use the built-in CORS proxy fallback

When developing locally, if a direct request fails due to CORS, the application will automatically try to fetch the data through a CORS proxy (corsproxy.io).

#### Option 2: Run Chrome with CORS disabled

For development purposes only, you can launch Chrome with web security disabled:

**Windows**:
```
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir=C:\temp\chrome-dev
```

**macOS**:
```
open -n -a "Google Chrome" --args --disable-web-security --user-data-dir=/tmp/chrome-dev
```

**Linux**:
```
google-chrome --disable-web-security --user-data-dir=/tmp/chrome-dev
```

#### Option 3: Use browser extensions

Extensions like "CORS Unblock" or "Allow CORS" can temporarily disable CORS for development.

#### Option 4: Set up a local proxy server

You can set up a local proxy server that adds the necessary CORS headers:

```javascript
// proxy.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

app.use('/api', createProxyMiddleware({
  target: 'https://feed.ipmhub.io',
  changeOrigin: true,
  pathRewrite: {'^/api': '/'},
}));

app.listen(3000, () => {
  console.log('CORS proxy server running on http://localhost:3000');
});
```

Then install dependencies and run:
```
npm init -y
npm install express cors http-proxy-middleware
node proxy.js
```

## Deployment

Deploy to GitHub Pages:

1. Push the code to a GitHub repository
2. Go to Settings > Pages
3. Select the main branch as the source
4. Your site will be available at https://[username].github.io/[repo-name]/

## Notes

- This application is designed to work as a static site and doesn't require a backend
- All data is fetched directly from the IPM Hub feed service
- User preferences and recently viewed packages are stored in browser cookies
