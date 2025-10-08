const http = require('http');
const https = require('https');
const url = require('url');
const net = require('net');

class ProxyServer {
  constructor(settings) {
    this.settings = settings;
    this.server = null;
    this.running = false;
    this.interceptCount = 0;
    
    // List of IP geolocation API endpoints
    this.geoAPIs = [
      'ipapi.co',
      'ip-api.com',
      'ipinfo.io',
      'freegeoip',
      'geoip-db.com',
      'ipgeolocation.io',
      'extreme-ip-lookup.com',
      'ipwhois.app',
      'ipstack.com',
      'abstractapi.com'
    ];
  }

  start() {
    return new Promise((resolve, reject) => {
      try {
        this.server = http.createServer((req, res) => {
          this.handleRequest(req, res);
        });

        // Handle HTTPS CONNECT method for tunneling
        this.server.on('connect', (req, clientSocket, head) => {
          this.handleConnect(req, clientSocket, head);
        });

        this.server.on('error', (err) => {
          console.error('Proxy server error:', err);
          reject(err);
        });

        this.server.listen(this.settings.port, '0.0.0.0', () => {
          this.running = true;
          console.log(`Proxy server running on http://0.0.0.0:${this.settings.port}`);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  handleConnect(req, clientSocket, head) {
    const { hostname, port } = this.parseHostPort(req.url);
    
    // Check if this is a known geolocation API over HTTPS
    const isGeoAPI = this.isGeoAPIRequest(hostname);
    
    if (isGeoAPI) {
      console.log(`[⚠️  HTTPS GEO API] ${hostname}:${port} - Cannot intercept HTTPS without certificate`);
      console.log(`[TIP] Use the browser extension for JavaScript geolocation API spoofing`);
    } else {
      console.log(`[CONNECT] ${hostname}:${port}`);
    }

    // Tunnel the connection (can't intercept HTTPS without MITM certificate)
    const serverSocket = net.connect(port || 443, hostname, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', (err) => {
      console.error(`[CONNECT ERROR] ${hostname}:${port}`, err.message);
      clientSocket.end();
    });

    clientSocket.on('error', (err) => {
      console.error('[CLIENT ERROR]', err.message);
      serverSocket.end();
    });
  }

  parseHostPort(hostString) {
    const parts = hostString.split(':');
    return {
      hostname: parts[0],
      port: parts[1] || 443
    };
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.running = false;
      console.log('Proxy server stopped');
    }
  }

  isRunning() {
    return this.running;
  }

  handleRequest(clientReq, clientRes) {
    const requestUrl = clientReq.url;
    
    // Parse the full URL from the request
    let targetUrl;
    try {
      targetUrl = new URL(requestUrl);
    } catch (e) {
      // If URL parsing fails, try to construct it from headers
      const host = clientReq.headers.host;
      const protocol = clientReq.connection.encrypted ? 'https:' : 'http:';
      try {
        targetUrl = new URL(`${protocol}//${host}${requestUrl}`);
      } catch (e2) {
        console.error('Invalid URL:', requestUrl);
        clientRes.writeHead(400);
        clientRes.end('Bad Request');
        return;
      }
    }
    
    // Check if this is a geolocation API request (by hostname or path)
    const isGeoByHost = this.isGeoAPIRequest(targetUrl.hostname);
    const isGeoByPath = this.hasGeoPath(targetUrl.pathname);
    
    if (isGeoByHost || isGeoByPath) {
      this.interceptCount++;
      console.log(`[INTERCEPT #${this.interceptCount}] ${targetUrl.hostname}${targetUrl.pathname}`);
      this.sendSpoofedResponse(clientRes);
      return;
    }

    // For non-geo requests, proxy them normally
    this.proxyRequest(clientReq, clientRes, targetUrl);
  }
  
  hasGeoPath(pathname) {
    const pathLower = pathname.toLowerCase();
    // Detect common geolocation API paths
    const geoPaths = ['/json', '/geo', '/location', '/ip', '/city', '/country', '/v1/json', '/api/ip'];
    return geoPaths.some(path => pathLower.includes(path)) && 
           (pathLower.length < 50); // Avoid false positives from long URLs
  }

  isGeoAPIRequest(hostname) {
    const hostnameLower = hostname.toLowerCase();
    
    // Method 1: Check against known API list
    const isKnownAPI = this.geoAPIs.some(api => hostnameLower.includes(api));
    
    // Method 2: Smart detection - check if hostname contains geo/ip/location keywords
    const geoKeywords = ['geoip', 'iplocation', 'ipapi', 'geolocation', 'ip-api', 'ipwhois', 'ipinfo'];
    const hasGeoKeyword = geoKeywords.some(keyword => hostnameLower.includes(keyword));
    
    return isKnownAPI || hasGeoKeyword;
  }

  sendSpoofedResponse(clientRes) {
    const fakeData = {
      // IP information
      ip: "185.156.177.123",
      
      // Location data from user settings
      latitude: parseFloat(this.settings.latitude),
      longitude: parseFloat(this.settings.longitude),
      lat: parseFloat(this.settings.latitude),
      lon: parseFloat(this.settings.longitude),
      
      // Additional location details
      city: this.settings.city || "Paris",
      region: this.settings.region || "Île-de-France",
      country: this.settings.country || "France",
      country_code: this.settings.countryCode || "FR",
      country_name: this.settings.country || "France",
      
      // Timezone
      timezone: this.settings.timezone || "Europe/Paris",
      utc_offset: "+0100",
      
      // Additional fields
      postal: this.settings.postal || "75001",
      org: "Fake ISP",
      asn: "AS12345",
      
      // Status
      status: "success",
      message: "success"
    };

    const responseBody = JSON.stringify(fakeData);
    
    clientRes.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    clientRes.end(responseBody);
    console.log(`[SPOOFED] Returned location: ${this.settings.latitude}, ${this.settings.longitude}`);
  }

  proxyRequest(clientReq, clientRes, targetUrl) {
    try {
      // Determine if HTTPS or HTTP
      const isHttps = targetUrl.protocol === 'https:';
      const protocol = isHttps ? https : http;
      const port = targetUrl.port || (isHttps ? 443 : 80);
      
      const options = {
        hostname: targetUrl.hostname,
        port: port,
        path: targetUrl.pathname + targetUrl.search,
        method: clientReq.method,
        headers: clientReq.headers
      };

      console.log(`[PROXY] ${clientReq.method} ${targetUrl.hostname}${targetUrl.pathname}`);

      const proxyReq = protocol.request(options, (proxyRes) => {
        const contentType = proxyRes.headers['content-type'] || '';
        
        // If JSON response, inspect it for geolocation data
        if (contentType.includes('application/json')) {
          this.inspectJSONResponse(proxyRes, clientRes, targetUrl);
        } else {
          // Forward non-JSON responses directly
          clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(clientRes);
        }
      });

      proxyReq.on('error', (err) => {
        console.error('Proxy request error:', err.message);
        if (!clientRes.headersSent) {
          clientRes.writeHead(502);
          clientRes.end('Bad Gateway: Cannot reach destination');
        }
      });

      // Forward the request body
      clientReq.pipe(proxyReq);
      
    } catch (error) {
      console.error('Proxy error:', error.message);
      if (!clientRes.headersSent) {
        clientRes.writeHead(500);
        clientRes.end('Internal Proxy Error');
      }
    }
  }

  inspectJSONResponse(proxyRes, clientRes, targetUrl) {
    let body = '';
    
    proxyRes.on('data', (chunk) => {
      body += chunk.toString();
    });

    proxyRes.on('end', () => {
      try {
        // Try to parse the JSON
        const jsonData = JSON.parse(body);
        
        // Check if this JSON contains geolocation data
        if (this.isGeoLocationData(jsonData)) {
          this.interceptCount++;
          console.log(`[SMART INTERCEPT #${this.interceptCount}] Detected geo data in ${targetUrl.hostname}${targetUrl.pathname}`);
          console.log(`[DETECTED FIELDS] ${Object.keys(jsonData).join(', ')}`);
          
          // Replace with spoofed data
          this.sendSpoofedResponse(clientRes);
        } else {
          // Not geolocation data, forward original response
          clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
          clientRes.end(body);
        }
      } catch (e) {
        // Invalid JSON, forward as-is
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        clientRes.end(body);
      }
    });

    proxyRes.on('error', (err) => {
      console.error('Response error:', err.message);
      if (!clientRes.headersSent) {
        clientRes.writeHead(500);
        clientRes.end('Error reading response');
      }
    });
  }

  isGeoLocationData(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') {
      return false;
    }

    // Check for common geolocation fields
    const geoFields = [
      'latitude', 'longitude', 'lat', 'lon', 'lng',
      'city', 'country', 'country_code', 'country_name',
      'region', 'postal', 'zip', 'timezone',
      'location', 'coordinates', 'geo'
    ];

    // Count how many geo-related fields are present
    let geoFieldCount = 0;
    const keys = Object.keys(jsonData);
    
    for (const key of keys) {
      const keyLower = key.toLowerCase();
      if (geoFields.some(field => keyLower.includes(field))) {
        geoFieldCount++;
      }
    }

    // If 3+ geolocation fields present, it's likely geolocation data
    const hasGeoFields = geoFieldCount >= 3;

    // Also check for IP field (common in geo APIs)
    const hasIPField = keys.some(key => key.toLowerCase() === 'ip' || key.toLowerCase() === 'query');

    return hasGeoFields || (geoFieldCount >= 2 && hasIPField);
  }
}

module.exports = ProxyServer;
