from flask import Flask, request, jsonify,render_template
import os
from util import upload_image,search_google_shopping
app = Flask(__name__)


import requests
import json

# MongoDB Data API details

API_KEY = "" #mongodb Api Url
BASE_URL = f"https://ap-south-1.aws.data.mongodb-api.com/app/data-oxgezlo/endpoint/data/v1/action"
HEADERS = {
    "Content-Type": "application/json",
    "api-key": API_KEY
}

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def insert_document(image_id,cdn_url,results):
    url = f"{BASE_URL}/insertOne"
    payload = {
        "dataSource": "wardrobe-products",
        "database": "Searchable",
        "collection": "store",
        "document": {
            "image_id":image_id,
            "cdn_url":cdn_url,
            "results":results
        }
    }
    
    response = requests.post(url, headers=HEADERS, json=payload)
    # print(response)

def find_all_documents():
    url = f"{BASE_URL}/find"
    payload = {
        "dataSource": "wardrobe-products",
        "database": "Searchable",
        "collection": "store",
        "filter": {}, 
        "limit": 100
    }
    
    response = requests.post(url, headers=HEADERS, json=payload)
    
    if response.status_code == 200:
        return response.json()["documents"]  # Return list of documents
    else:
        return f"Error {response.status_code}: {response.text}"  # Handle errors


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    image_id = file.filename.split('.')[0]
    # Save the file to the upload folder
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    cdn_url = upload_image(filepath)
    results = search_google_shopping(cdn_url)
    insert_document(image_id,cdn_url,results)

    return jsonify({'message': 'File uploaded successfully', 'filename': file.filename})


@app.route('/results',methods=['GET']) 
def results():
    resp = find_all_documents()
    return render_template('results.html',data=resp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
