from flask import Flask, request, jsonify
from ytmusicapi.parsers import search  # Ajusta la importación según tus archivos

app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search_songs():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    results = search(query)  # Suponiendo que `search` es una función en `search.py`
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
