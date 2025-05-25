from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

# Change to the frontend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create and start the server
server = HTTPServer(('localhost', 8080), SimpleHTTPRequestHandler)
print(f"Server running at http://localhost:8080")
server.serve_forever()
