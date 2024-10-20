from ytmusicapi import YTMusic
import sys
import json

# Inicializar YTMusic una vez para reutilizar en las funciones
yt = YTMusic()

def search(query):
    search_results = yt.search(query)
    return {"results": search_results}

def get_search_suggestions(query):
    suggestions = yt.get_search_suggestions(query)
    return {"suggestions": suggestions}

def get_home():
    home_content = yt.get_home()
    return {"home": home_content}

def get_artist(artist_id):
    artist = yt.get_artist(artist_id)
    return {"artist": artist}

def get_artist_albums(artist_id, album_type="albums"):
    albums = yt.get_artist_albums(artist_id, album_type)
    return {"albums": albums}

def get_album(album_id):
    album = yt.get_album(album_id)
    return {"album": album}

def get_album_browse_id(album_id):
    browse_id = yt.get_album_browse_id(album_id)
    return {"browse_id": browse_id}

def get_user(user_id):
    user = yt.get_user(user_id)
    return {"user": user}

def get_user_playlists(user_id):
    playlists = yt.get_user_playlists(user_id)
    return {"playlists": playlists}

def get_user_videos(user_id):
    videos = yt.get_user_videos(user_id)
    return {"videos": videos}

def get_song(song_id):
    song = yt.get_song(song_id)
    return {"song": song}

def get_song_related(song_id):
    related_songs = yt.get_song_related(song_id)
    return {"related_songs": related_songs}

def get_lyrics(song_id):
    lyrics = yt.get_lyrics(song_id)
    return {"lyrics": lyrics}

def get_tasteprofile():
    taste_profile = yt.get_tasteprofile()
    return {"taste_profile": taste_profile}

def set_tasteprofile(profile_id, preferences):
    response = yt.set_tasteprofile(profile_id, preferences)
    return {"response": response}

if __name__ == "__main__":
    command = sys.argv[1]
    query = sys.argv[2] if len(sys.argv) > 2 else None

    if command == "search" and query:
        results = search(query)
    elif command == "suggestions" and query:
        results = get_search_suggestions(query)
    elif command == "get_home":
        results = get_home()
    elif command == "get_artist" and query:
        results = get_artist(query)
    elif command == "get_artist_albums" and query:
        album_type = sys.argv[3] if len(sys.argv) > 3 else "albums"
        results = get_artist_albums(query, album_type)
    elif command == "get_album" and query:
        results = get_album(query)
    elif command == "get_album_browse_id" and query:
        results = get_album_browse_id(query)
    elif command == "get_user" and query:
        results = get_user(query)
    elif command == "get_user_playlists" and query:
        results = get_user_playlists(query)
    elif command == "get_user_videos" and query:
        results = get_user_videos(query)
    elif command == "get_song" and query:
        results = get_song(query)
    elif command == "get_song_related" and query:
        results = get_song_related(query)
    elif command == "get_lyrics" and query:
        results = get_lyrics(query)
    elif command == "get_tasteprofile":
        results = get_tasteprofile()
    elif command == "set_tasteprofile" and query:
        preferences = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
        results = set_tasteprofile(query, preferences)
    else:
        results = {"error": "Invalid command or missing query"}

    print(json.dumps(results))
