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
KEYWORDS = ['happy', 'angry', 'sad', 'depressed', 'delighted']


# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


# Securely generate and use admin_password_hash
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


@app.route('/match-words', methods=['POST'])
def match_words():
    data = request.json
    text = data.get('text', '')
    matches = []
    for keyword in KEYWORDS:
        start = text.find(keyword)
        if start != -1:
            matches.append({'start': start, 'end': start + len(keyword)})
    return jsonify({'matches': matches})

if __name__ == "__main__":
    app.run(debug=True)
