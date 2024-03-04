from flask import Flask, request, jsonify
from flask_cors import CORS
import chromadb
import json
import os
import hashlib

app = Flask(__name__)
CORS(app)

PERSISTENCE_PATH = "chroma_data"
chroma_client = chromadb.PersistentClient(path=PERSISTENCE_PATH)

# Ensure collection exists
try:
    collection = chroma_client.get_collection(name="song_collection")
except Exception as e:
    print(f"Collection not found, creating a new one... Error: {e}")
    collection = chroma_client.create_collection(name="song_collection")

@app.route('/add_song', methods=['POST'])
def add_song():
    try:
        song_data = request.json
        metadata = song_data['metadata']

        # Convert lists to comma-separated strings
        metadata['singers'] = ', '.join(metadata.get('singers', []))
        metadata['labels'] = ', '.join(metadata.get('labels', []))

        # Convert the 'links' dict to a JSON string or handle differently as needed
        metadata['links'] = json.dumps(metadata.get('links', {}))

        lyrics = song_data['lyrics']
        hash_value = generate_hash(metadata, lyrics)

        collection.add(
            documents=[lyrics],
            metadatas=[metadata],
            ids=[hash_value]
        )
        return jsonify({"message": "Song added successfully"}), 200
    except Exception as e:
        print(f"Error adding song: {e}")
        return jsonify({"error": str(e)}), 500

def generate_hash(metadata, lyrics):
    hash_input = json.dumps(metadata, sort_keys=True) + lyrics
    return hashlib.sha256(hash_input.encode()).hexdigest()

if __name__ == '__main__':
    app.run(debug=True)
