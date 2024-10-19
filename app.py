from flask import Flask, request, jsonify
from ytmusicapi.parsers import search, songs  # Importar los módulos Python según la estructura

app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search_songs():
    query = request.args.get('query')
    results = search(query)  # Suponiendo que `search` es una función en `search.py`
    return jsonify(results)

@app.route('/song', methods=['GET'])
def get_song():
    song_id = request.args.get('id')
    result = songs.get_song(song_id)  # Suponiendo que `get_song` es una función en `songs.py`
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
