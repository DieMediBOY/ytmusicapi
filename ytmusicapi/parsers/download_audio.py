import yt_dlp
import json
import sys

def download_audio(youtube_id):
    # Construir la URL de YouTube a partir del ID
    youtube_url = f"https://www.youtube.com/watch?v={youtube_id}"
    
    # Opciones para yt-dlp
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{youtube_id}.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,  # Suprimir mensajes de descarga
        'no_warnings': True  # Suprimir advertencias
    }

    try:
        # Descargar el audio con yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])

        mp3_filename = f"{youtube_id}.mp3"
        return {"status": "success", "file": mp3_filename}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No YouTube ID provided"}))
    else:
        youtube_id = sys.argv[1]
        result = download_audio(youtube_id)
        # Imprimir la salida como JSON
        print(json.dumps(result))
