import http.server
import socketserver
import webbrowser
import os
import sys

app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app')
os.chdir(app_dir)

# Preferred ports to try in sequence
PORTS = [8000, 3000, 5500, 8888, 9000]

server_started = False
for port in PORTS:
    try:
        class QuietHandler(http.server.SimpleHTTPRequestHandler):
            # Keeps console clean and prevents local caching
            def log_message(self, format, *args):
                pass
            def end_headers(self):
                self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
                super().end_headers()

        httpd = socketserver.TCPServer(("127.0.0.1", port), QuietHandler)
        url = f"http://localhost:{port}"
        print("===================================================================")
        print("              SENSUiKAN - SERVIDOR LOCAL EN MARCHA")
        print("===================================================================")
        print(f" -> Servidor activo en:  {url}")
        print(" -> Abriendo en tu navegador predeterminado...")
        print("-------------------------------------------------------------------")
        print(" [INFO] Guarda cualquier cambio en app/index.html o app/i18n.js")
        print("        y pulsa F5 en el navegador para verlo de inmediato.")
        print("-------------------------------------------------------------------")
        print(" Presiona Ctrl + C para detener el servidor.")
        print("===================================================================")
        
        webbrowser.open(url)
        server_started = True
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido. ¡Hasta pronto!")
            httpd.server_close()
        break
    except OSError as e:
        # Port blocked or occupied, try next
        continue

if not server_started:
    print("Error: No se pudo abrir un socket en los puertos habituales (8000, 3000, 5500, 8888).")
    print("Revisa los permisos de red o firewall de tu equipo.")
