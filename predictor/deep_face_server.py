from PIL import Image
import cv2
from deepface.commons.functions import base64
import numpy as np


from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from deepface import DeepFace
app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok'})


@app.route('/predict', methods=['POST'])
def predict():

    # If there is no image in the request body, return an error
    if 'image' not in request.files:
        return jsonify({'ok': False, 'error': 'No image in request'})

    # Get the image from the request
    file = request.files['image']

    img = Image.open(file.stream)
    image_np = np.array(img)
    # NOTE: it must match the client capture size
    image = cv2.resize(image_np, (500, 300))
    color_img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # cv2.imwrite('resized_image.png', np.float32(color_img))

    try:
        prediction = DeepFace.analyze(color_img)
    except:
        return jsonify({
            'ok': False,
            'error': 'No se pudo detectar el rostro, reintente.'
        })

    return jsonify({
        'ok': True,
        'prediction': prediction[0]['dominant_emotion'],
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8200, debug=True)
