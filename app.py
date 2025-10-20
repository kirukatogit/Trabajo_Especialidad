from flask import Flask, send_from_directory
import os
from pathlib import Path

# Servir la carpeta 'src' que está en la raíz del proyecto
app = Flask(__name__, static_folder="src", static_url_path="/static")

@app.route("/")
def index():
    index_path = Path(app.static_folder) / "index.html"
    if index_path.exists():
        return send_from_directory(app.static_folder, "index.html")
    return "Frontend no encontrado (fallback). API en /api"

@app.route("/<path:path>")
def catch_all(path):
    # Si el archivo solicitado existe en src, servirlo; si no, devolver index.html (SPA)
    file_path = Path(app.static_folder) / path
    if file_path.exists():
        return send_from_directory(app.static_folder, path)
    index_path = Path(app.static_folder) / "index.html"
    if index_path.exists():
        return send_from_directory(app.static_folder, "index.html")
    return "Frontend no encontrado (fallback)"

@app.route("/api")
def api():
    return "Hola desde Docker y Flask!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)