from flask import Flask, request, render_template
import json
from yt_dlp import YoutubeDL
import requests


app = Flask(__name__)
ydl = YoutubeDL()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/tablize')
def tablize():
    return render_template('table.html')


@app.route('/server_route')
def tabulate():

    try:
        url_values = request.args.getlist('url')

        json_array = []

        for i, url in enumerate(url_values):
            try:
                json_array += [{**{'s_no': i+1,
                                   'Status': 'OK'}, **info(url, ydl)}]
            except Exception as e:
                json_array += [{'s_no': i+1,
                                'Status': f'ERROR : {str(e.__context__)}'}]

        return json.dumps(json_array), 200

    except Exception as e:
        return {'error': str(e)}, 400


def info(url: str, ydl:  YoutubeDL) -> dict:
    info = ydl.extract_info(url, download=False)

    if info != None:
        return info
    else:
        raise Exception('Unknown')


if __name__ == '__main__':
    app.run()
