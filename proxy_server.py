import http.server
import socketserver
import urllib.request
import urllib.error
import shutil
import sys
import os

# Configuration
PORT = 8000
TARGET_BASE_URL = "http://192.168.1.166:30776"

# Create a Threading TCPServer to handle multiple requests at once
# This is crucial for streaming audio while still loading UI elements
class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self._handle_request()

    def do_POST(self):
        self._handle_request()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.end_headers()

    def _handle_request(self):
        path_without_query = self.path.split('?')[0]
        if path_without_query.startswith('/'):
            local_path = path_without_query[1:]
        else:
            local_path = path_without_query
            
        if local_path == "" or local_path.endswith("/"):
            local_path += "index.html"

        # Check if local file exists
        if os.path.exists(local_path) and not os.path.isdir(local_path):
            super().do_GET()
        else:
            self._proxy_request()

    def _proxy_request(self):
        target_url = f"{TARGET_BASE_URL}{self.path}"
        # Print less verbose logs for streams to avoid clutter
        if "action=stream" not in self.path:
            print(f"Proxying {self.command}: {self.path}")

        try:
            headers = {}
            for key, value in self.headers.items():
                if key.lower() not in ['host', 'content-length']:
                    headers[key] = value
            
            data = None
            if self.command == 'POST':
                content_len = int(self.headers.get('Content-Length', 0))
                if content_len > 0:
                    data = self.rfile.read(content_len)

            req = urllib.request.Request(target_url, data=data, headers=headers, method=self.command)

            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                
                for key, value in response.headers.items():
                    # Forward all safe headers
                    if key.lower() not in ['transfer-encoding', 'content-encoding', 'content-length', 'connection', 'access-control-allow-origin']:
                        self.send_header(key, value)
                
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                shutil.copyfileobj(response, self.wfile)

        except urllib.error.HTTPError as e:
            # Only log real errors, 404s might be common for some assets
            if e.code != 404:
                print(f"  HTTP Error {e.code}: {e.reason}")
            
            self.send_response(e.code)
            self.end_headers()
            if e.fp:
                shutil.copyfileobj(e, self.wfile)
        except ConnectionResetError:
            # Expected when client stops stream
            pass
        except Exception as e:
            print(f"  Error: {e}")
            try:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Internal Server Error: {e}".encode())
            except:
                pass

if __name__ == "__main__":
    # SERVE FROM DIST FOLDER
    dist_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
    if os.path.exists(dist_dir):
        os.chdir(dist_dir)
    else:
        print("Error: 'dist' directory not found. Please run 'npm run build' first.")
        sys.exit(1)
        
    ThreadingTCPServer.allow_reuse_address = True
    
    print(f"Starting Multi-threaded Proxy at http://localhost:{PORT}")
    print(f"Serving local files from {os.getcwd()}")
    print(f"Forwarding everything else to {TARGET_BASE_URL}")
    
    with ThreadingTCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping...")
