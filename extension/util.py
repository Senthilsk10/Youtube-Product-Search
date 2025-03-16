import requests
import json
# FreeImageHost API Endpoint
API_URL = "https://freeimage.host/api/1/upload"

# Your FreeImageHost API Key (replace with your actual key)
API_KEY = "" # from free image host

def upload_image(image_path):
    """Uploads an image and returns the CDN URL."""
    with open(image_path, "rb") as image_file:
        files = {"source": image_file}
        data = {"key": API_KEY, "format": "json"}  # Request in JSON format
        response = requests.post(API_URL, files=files, data=data)

    # Parse response
    if response.status_code == 200:
        result = response.json()
        if "image" in result and "url" in result["image"]:
            return result["image"]["url"]
        else:
            return "Error: Invalid API response"
    else:
        return f"Error: {response.status_code} - {response.text}"

# # Example Usage
# image_path = "C:/Users/DELL/Downloads/Screenshot-YouTube-master/Screenshot-YouTube-master/extension/uploads/1740651761504.png"  # Replace with your image path
# cdn_url = upload_image(image_path)
# print("CDN URL:", cdn_url)

import requests

def search_google_shopping(image_url, location="Tamil Nadu, India", lang="ta", country="in"):
    """Search Google Shopping results using SerpAPI."""
    
    url = "https://serpapi.com/search"
    api_key = "" #serp Api key
    params = {
        "api_key": api_key,
        "engine": "google_lens",
        "url": image_url,
        "location": location,
        "google_domain": "google.co.in",
        "gl": country,
        "hl": lang,
        "tbm": "shop",
        "num":5
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        result =  response.json()
        # print(result.keys())
        # print(result['visual_matches'])
        matches = result['visual_matches'][:15]
        return matches
    else:
        return f"Error {response.status_code}: {response.text}"  # Handle errors

# # Example usage

# result = search_google_shopping("https://iili.io/3dMZIvR.png")
# 
# print(json.dumps(result))  # Print the JSON response
