import yt_dlp
import sys
import os

def download_audio(youtube_id):
    youtube_url = f"https://www.youtube.com/watch?v={youtube_id}"
    output_filename = f"{youtube_id}.mp3"
    output_path = os.path.join(os.getcwd(), output_filename)
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{youtube_id}.%(ext)s',
        'quiet': True,  # Evita mensajes innecesarios
        'no_warnings': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    try:
        print(f"Current working directory: {os.getcwd()}")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])

        if os.path.exists(output_path):
            print(f"File generated: {output_filename}")
            print(f"Available files: {os.listdir(os.getcwd())}")
            print(output_filename)  # Imprimir solo el nombre del archivo
        else:
            print(f"ERROR: File not found at {output_path}")

    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: No YouTube ID provided")
    else:
        youtube_id = sys.argv[1]
        download_audio(youtube_id)
