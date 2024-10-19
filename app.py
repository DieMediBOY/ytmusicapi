from flask import Flask, request, jsonify
import sys
import json
from ytmusicapi.parsers.search import search  # Ajusta la ruta según tu estructura

app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search_songs():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    # Llamar a la función de búsqueda importada
    results = search(query)
    return jsonify(results)

@app.route('/', methods=['GET'])
def welcome():
    return "Bienvenido Python"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
