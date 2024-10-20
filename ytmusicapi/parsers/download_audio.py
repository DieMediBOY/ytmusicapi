import yt_dlp
import json
import sys
import os

def download_audio(youtube_id):
    # Construir la URL de YouTube a partir del ID
    youtube_url = f"https://www.youtube.com/watch?v={youtube_id}"
    
    # Opciones para yt-dlp
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{youtube_id}.%(ext)s',
        'quiet': True,  # Suprime los mensajes de progreso
        'no_warnings': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    try:
        # Descargar el audio con yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])

        mp3_filename = f"{youtube_id}.mp3"
        
        # Verificar que el archivo MP3 existe
        if os.path.exists(mp3_filename):
            return {"status": "success", "file": mp3_filename}
        else:
            return {"status": "error", "message": "File not found after download."}

    except Exception as e:
        # Devuelve un JSON con el error
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No YouTube ID provided"}))
    else:
        youtube_id = sys.argv[1]
        result = download_audio(youtube_id)
        # Asegurarse de que solo imprimimos JSON válido
        print(json.dumps(result))
