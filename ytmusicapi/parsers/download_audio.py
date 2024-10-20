from flask import Flask, request, jsonify
import os
import yt_dlp

app = Flask(__name__)

@app.route('/download', methods=['GET'])
def download_audio():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({"error": "No video ID provided"}), 400
    
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': f'/app/{video_id}.%(ext)s'
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([f'https://www.youtube.com/watch?v={video_id}'])

        file_path = f'/app/{video_id}.mp3'
        if os.path.exists(file_path):
            return jsonify({"status": "success", "url": f"/stream/{video_id}"}), 200
        else:
            return jsonify({"error": "File not found after download"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stream/<video_id>', methods=['GET'])
def stream_audio(video_id):
    file_path = f'/app/{video_id}.mp3'
    if os.path.exists(file_path):
        return app.send_static_file(f'{video_id}.mp3')
    else:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
