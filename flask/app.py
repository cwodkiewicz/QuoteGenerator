from flask import Flask, request, jsonify
from sense_hat import SenseHat
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
sense = SenseHat()

category_colors = {
    "age": (255, 140, 0),           # Dark Orange
    "athletics": (0, 128, 0),       # Dark Green
    "business": (0, 0, 128),        # Dark Blue
    "change": (255, 0, 255),        # Magenta
    "character": (139, 69, 19),     # Saddle Brown
    "competition": (255, 0, 0),     # Red
    "conservative": (128, 0, 128),  # Purple
    "courage": (255, 69, 0),        # Red-Orange
    "creativity": (255, 165, 0),    # Orange
    "education": (0, 255, 255),     # Cyan
    "ethics": (255, 192, 203),      # Pink
    "failure": (128, 128, 128),     # Gray
    "faith": (255, 255, 0),         # Yellow
    "family": (173, 216, 230),      # Light Blue
    "famous-quotes": (255, 69, 0),  # Red-Orange
    "film": (255, 20, 147),         # Deep Pink
    "freedom": (0, 191, 255),       # Deep Sky Blue
    "friendship": (255, 215, 0),    # Gold
    "future": (75, 0, 130),         # Indigo
    "generosity": (154, 205, 50),   # Yellow Green
    "genius": (255, 99, 71),        # Tomato
    "gratitude": (0, 128, 128),     # Teal
    "happiness": (255, 255, 0),     # Yellow
    "health": (0, 255, 0),          # Lime
    "history": (169, 169, 169),     # Dark Gray
    "honor": (218, 112, 214),       # Orchid
    "humor": (255, 20, 147),        # Deep Pink
    "humorous": (255, 69, 0),       # Red-Orange
    "imagination": (128, 0, 128),   # Purple
    "inspirational": (255, 69, 0),  # Red-Orange
    "knowledge": (0, 0, 255),       # Blue
    "leadership": (255, 165, 0),    # Orange
    "life": (255, 99, 71),          # Tomato
    "literature": (255, 20, 147),    # Deep Pink
    "love": (255, 0, 0),            # Red
    "mathematics": (0, 0, 128),     # Dark Blue
    "motivational": (255, 69, 0),   # Red-Orange
    "nature": (34, 139, 34),        # Forest Green
    "opportunity": (255, 255, 0),   # Yellow
    "pain": (255, 0, 0),            # Red
    "perseverance": (255, 99, 71),  # Tomato
    "philosophy": (139, 69, 19),    # Saddle Brown
    "politics": (255, 0, 0),        # Red
    "power-quotes": (255, 69, 0),   # Red-Orange
    "proverb": (255, 215, 0),       # Gold
    "religion": (139, 0, 139),      # Dark Magenta
    "sadness": (0, 0, 128),         # Dark Blue
    "science": (0, 255, 0),         # Lime
    "self": (255, 215, 0),          # Gold
    "self-help": (255, 215, 0),     # Gold
    "social-justice": (255, 69, 0), # Red-Orange
    "society": (255, 99, 71),       # Tomato
    "spirituality": (139, 69, 19),  # Saddle Brown
    "sports": (0, 0, 255),          # Blue
    "stupidity": (255, 0, 0),       # Red
    "success": (0, 128, 0),         # Green
    "technology": (0, 191, 255),    # Deep Sky Blue
    "time": (128, 0, 128),          # Purple
    "tolerance": (255, 255, 255),   # White
    "truth": (0, 0, 0),             # Black
    "virtue": (0, 0, 255),          # Blue
    "war": (255, 0, 0),             # Red
    "weakness": (255, 99, 71),      # Tomato
    "wellness": (0, 128, 0),        # Green
    "wisdom": (218, 112, 214),      # Orchid
    "work": (128, 128, 128)         # Gray
}


@app.route('/receive-quote', methods=['POST'])
def receive_quote():
    try:
        data = request.get_json()
        quote = data.get('quote', '')
        category = data.get('category')
        
        # Call the function to display the quote on the LED matrix
        display_quote_on_led_matrix(quote, category)

        return jsonify({'status': 'success', 'message': 'Quote received and displayed.'})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def display_quote_on_led_matrix(quote, category):
    try:
        # Hardcoded colors
        text_color = category_colors.get(category, (255, 255, 255))  # Default:>
        background_color = (0, 0, 0)  # Black

        # Display the quote on the LED matrix
        sense.show_message(quote, text_colour=text_color, back_colour=background_color)



    except Exception as e:
        print(f'Error displaying quote on LED Matrix: {str(e)}')

if __name__ == '__main__':
    # Change the host and port as needed
    app.run(host='0.0.0.0', port=5000)



