# wordpress_puppet_api

## Overview
Many WordPress providers don’t offer API access in their free plans. This is because the hosting accounts they provide are meant for hosting websites, not APIs. As a result, users on free or non-premium plans often find themselves unable to use WordPress APIs for posting content.

**wordpress_puppet_api** solves this problem by providing an API that allows users to post WordPress content even when API access is restricted. This is achieved by using Puppeteer to call the WordPress API from the browser, making it seem like the API calls originate from the browser itself.

If you’re someone who wants to automate WordPress content posting but can’t afford premium hosting services, this tool is perfect for you.

## Features
- **Custom API:** Exposes an API endpoint to post data to your WordPress site.
- **Bypass API restrictions:** Post content even when your WordPress hosting plan doesn’t support official API access.
- **Automation:** Automate WordPress content posting without manual intervention.
- **Puppeteer-powered:** Uses Puppeteer to call WordPress API, making it appear as though the API is called from the browser.
- **Cost-effective:** No need for expensive premium hosting plans to access WordPress API capabilities.

## Prerequisites
- Node.js (v8 or compatible)
- Puppeteer library
- Express.js
- CORS middleware

## Installation
```bash
# Clone the repository
git clone https://github.com/sachhu/wordpress_puppet_api.git

# Navigate to the project directory
cd wordpress_puppet_api

# Install dependencies
npm install
```

## Usage
Start the server:
```bash
npm start
```

Send a POST request to the API:
```bash
curl -X POST http://localhost:3000/api/data \
     -H "Content-Type: application/json" \
     -d '{"title":"My First Automated Post","content":"This post was published using wordpress_puppet_api!","categories":["Tech"],"tags":["Automation"],"status":"publish"}'
```

## API Endpoint
**POST /api/data**

### Request Body
```json
{
  "title": "Your Post Title",
  "content": "Your post content here",
  "categories": ["Category1", "Category2"],
  "tags": ["tag1", "tag2"],
  "status": "publish"
}
```

## ENV Configuration
Create a .env file with blow envs
- **URL:** Wordpress website URL.
- **USERNAME:** Wordpress Username.
- **PASSWORD:** Wordpress API Password
- **PORT:** PORT number for wordpress_puppet_api. Default is 3000

## Limitations
- As this approach uses browser automation, performance may depend on your internet connection and the WordPress site’s response time.
- Ensure you comply with your WordPress hosting’s terms of service.

## Contributing
Contributions are welcome! Feel free to fork this repository and submit a pull request.

## License
This project is licensed under the MIT License.

