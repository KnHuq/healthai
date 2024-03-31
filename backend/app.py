import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import re


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "users.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


db = SQLAlchemy(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
KEYWORDS = [
    "goal",
    "diagnosis",
    "differential",
    "gap",
    "driver",
    "risks",
    "foreseeable",
    "available_resources",
    "present",
    "history",
    "symptom",
    "admission-to",
    "concerns",
    "current_episode",
    "experiencing",
    "arrived",
    "percipit",
    "context",
    "trigger",
    "relapse",
    "instigate",
    "induced",
    "exacerbated",
    "perpetuat",
    "contribute",
    "maintain",
    "lasted",
    "ongoing",
    "regular_use",
    "protect",
    "strength",
    "potential",
    "compliant",
    "coping",
    "hobbies",
    "improved",
    "improvement",
    "loving",
    "relationship",
    "friendship",
    "connection",
    "supported",
    "supportive",
]

# Your dictionary and word_to_category mapping here
Ps_dictionary = {
    "integrated_formulations": [
        "goal",
        "diagnosis",
        "differential",
        "gap",
        "driver",
        "risks",
        "foreseeable",
        "available_resources",
    ],
    "presentation_factors": [
        "present",
        "history",
        "symptom",
        "admission-to",
        "concerns",
        "current_episode",
        "experiencing",
        "arrived",
    ],
    "precipitating_factors": [
        "percipit",
        "context",
        "trigger",
        "relapse",
        "instigate",
        "induced",
        "exacerbated",
    ],
    "perpetuating_factors": [
        "perpetuat",
        "contribute",
        "maintain",
        "lasted",
        "ongoing",
        "regular_use",
    ],
    "protective_factors": [
        "protect",
        "strength",
        "potential",
        "compliant",
        "coping",
        "hobbies",
        "improved",
        "improvement",
        "loving",
        "relationship",
        "friendship",
        "connection",
        "supported",
        "supportive",
    ],
}


# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


# Securely generate and use admin_password_hash,
admin_password = os.environ.get(
    "ADMIN_PASSWORD", "default_admin_password"
)  # Fallback to a default if not set
admin_password_hash = bcrypt.generate_password_hash(admin_password).decode("utf-8")

# Ensure the database exists
with app.app_context():
    db.create_all()


# Routes
@app.route("/api/verify-admin", methods=["POST"])
def verify_admin():
    data = request.json
    admin_password = data.get("adminPassword")
    if bcrypt.check_password_hash(admin_password_hash, admin_password):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        # Generate username suggestions if the desired username is taken
        return jsonify({"success": False, "message": "Username not available"}), 409

    new_user = User(username=username)
    new_user.set_password(password)  # Hash and store password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return jsonify({"success": True, "message": "Logged in successfully"})
    return jsonify({"success": False, "message": "Incorrect username or password"}), 401


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = file.filename
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)
        return (
            jsonify({"message": "File uploaded successfully", "file_path": file_path}),
            200,
        )

    return jsonify({"error": "Failed to upload file"}), 500


@app.route("/match-words", methods=["POST"])
def match_words():
    data = request.json
    text = data.get("text", "").lower().strip()
    matches = []
    for keyword in KEYWORDS:
        start = 0  # Start from the beginning of the text
        while start < len(text):
            # Find the keyword starting from 'start'
            start = text.find(keyword, start)
            if start == -1:  # No more occurrences found
                break
            # Add the match with the current start and end indices
            matches.append({"start": start, "end": start + len(keyword)})
            start += len(
                keyword
            )  # Move past the current match to find subsequent matches
    return jsonify({"matches": matches})


"""function to match the words to dictionary"""

word_to_category = {}
for k, v in Ps_dictionary.items():
    for w in v:
        word_to_category[w.lower().strip()] = k


def get_category_from_word(word: str) -> str:
    """
    This will find the category of the word from the Ps dictionary
    """
    word = word.lower().strip()
    for key_word, category in word_to_category.items():
        if key_word in word:
            return category
    return "Unknown"  # Return "Unknown" instead of None for better handling in the frontend


@app.route("/category", methods=["GET"])
def category():
    """
    This will find the category of the word from the Ps dictionary
    """
    word = request.args.get("word", "")
    if word:
        category = get_category_from_word(word)
        return jsonify({"category": category})
    else:
        return jsonify({"error": "No word provided"}), 400


if __name__ == "__main__":
    app.run(debug=True)
