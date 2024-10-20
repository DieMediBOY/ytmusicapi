from flask import Flask, request, jsonify
from yt_dlp import YoutubeDL
import os

app = Flask(__name__)

@app.route('/download', methods=['GET'])
def download_audio():
    video_id = request.args.get('id')

    if not video_id:
        return jsonify({"error": "No se proporcionó ningún ID de video"}), 400

    try:
        # Configuración para descargar solo el audio en formato mp3
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': '/app/%(title)s.%(ext)s',  # Guardar archivo en el directorio de la app
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f'https://www.youtube.com/watch?v={video_id}', download=True)
            filename = ydl.prepare_filename(info)
            mp3_filename = filename.rsplit('.', 1)[0] + '.mp3'

            if os.path.exists(mp3_filename):
                return jsonify({"message": "Descarga completada", "file": mp3_filename})

            return jsonify({"error": "No se pudo descargar el archivo"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
