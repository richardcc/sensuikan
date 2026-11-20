import http.server
import socketserver
import os

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    app_dir = os.path.abspath('app')
    os.chdir(app_dir)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", 8000), NoCacheHandler) as httpd:
        print("Serving at port 8000 with no-cache headers from:", app_dir)
        httpd.serve_forever()
