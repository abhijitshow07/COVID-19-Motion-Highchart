# -*- coding: utf-8 -*-
"""
Created on Mon Jun  1 14:57:31 2020

@author: ABHIJIT SHOW
"""


from flask_cors import CORS, cross_origin
from flask import Flask, render_template, json, jsonify

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
@cross_origin()
def home():
    return render_template('index_motion.html')

@app.route('/corona_time_series')
@cross_origin()
def time_series():
    with open('corona_time_series.json') as file:
        corona_time_series = json.load(file)
    return jsonify(corona_time_series)

if __name__ == "__main__":
    app.run(host='0.0.0.0' , port=5000 ,threaded=True)