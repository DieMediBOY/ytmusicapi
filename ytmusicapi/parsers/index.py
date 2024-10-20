from ytmusicapi import YTMusic
import sys
import json

def search(query):
    # Inicializar YTMusic
    yt = YTMusic()  # Si necesitas autenticación, pasa la ruta de tu archivo: YTMusic('oauth.json')
    search_results = yt.search(query)
    return {"results": search_results}

def get_search_suggestions(query):
    # Inicializar YTMusic
    yt = YTMusic()
    suggestions = yt.get_search_suggestions(query)
    return {"suggestions": suggestions}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No query provided"}))
    else:
        query = sys.argv[1]
        command = sys.argv[2] if len(sys.argv) > 2 else "search"
        if command == "suggestions":
            results = get_search_suggestions(query)
        else:
            results = search(query)
        print(json.dumps(results))
