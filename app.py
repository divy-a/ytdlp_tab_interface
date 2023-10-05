
from flask import Flask, request, jsonify, render_template
import ytdlp_info_json
import json
import traceback

app = Flask(__name__)


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

        for url in url_values:
            try:
                json_array += [{**{'Status': 'OK'}, **ytdlp_info_json.info(url)}]
            except:
                json_array += [{'Status': 'ERROR'}]

        return json.dumps(json_array), 200

    except Exception as e:
        return {'error': str(e), 'traceback': traceback.format_exc()}, 400


if __name__ == '__main__':
    app.run()
