import yt_dlp

def info(url):
    with yt_dlp.YoutubeDL() as ydl:
        
        info = ydl.extract_info(url, download=False)
        
        return info