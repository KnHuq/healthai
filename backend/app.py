import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import re
from datetime import datetime, timedelta, date
import random
import logging

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "users.db")
app.config['SQLALCHEMY_BINDS'] = {
    'linechart_db': 'sqlite:///linechart_data.db',   # New database for this specific purpose
    'barchart_db': 'sqlite:///barchart_data.db' 
}
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



class Linechart_DataPoint(db.Model):
    __bind_key__ = 'linechart_db'
    date = db.Column(db.Date, default=date.today, index=True) 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    uv = db.Column(db.Integer, nullable=False)
    pv = db.Column(db.Integer, nullable=False)
    amt = db.Column(db.Integer, nullable=False)


class Barchart_DataPoint(db.Model):
    __bind_key__ = 'barchart_db'
    date = db.Column(db.Date, default=date.today, index=True) 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    uv = db.Column(db.Integer, nullable=False)
    pv = db.Column(db.Integer, nullable=False)
    amt = db.Column(db.Integer, nullable=False)    



def create_barchart_tables():
    # Explicitly creating tables for a specific bind
    engine = db.get_engine(app, bind='barchart_db')
    Barchart_DataPoint.metadata.create_all(engine)
    populate_Barchart_db()

def create_linechart_tables():
    # Explicitly creating tables for a specific bind
    engine = db.get_engine(app, bind='linechart_db')
    Linechart_DataPoint.metadata.create_all(engine)
    populate_linechart_db()    

'''def populate_db():
    data = [
        DataPoint(name="Page A", uv=4000, pv=2400, amt=2400),
        DataPoint(name="Page B", uv=3000, pv=1398, amt=2210),
        DataPoint(name="Page C", uv=2000, pv=9800, amt=2290),
        DataPoint(name="Page D", uv=2780, pv=3908, amt=2000),
        DataPoint(name="Page E", uv=1890, pv=4800, amt=2181),
        DataPoint(name="Page F", uv=2390, pv=3800, amt=2500),
        DataPoint(name="Page G", uv=3490, pv=4300, amt=2100),
    ]
    db.session.bulk_save_objects(data)
    db.session.commit()'''


def populate_linechart_db():
    start_date = datetime(2023, 1, 1)  # Start date of the data generation period
    end_date = datetime(2024, 5, 9)  # End date
    delta = timedelta(days=1)  # Difference of one day
    pages = ["Page A", "Page B", "Page C", "Page D", "Page E", "Page F", "Page G"]
    data = []

    current_date = start_date
    while current_date <= end_date:
        for page in pages:
            data.append(Linechart_DataPoint(
                name=page,
                uv=random.randint(1000, 5000),  # Random UV between 1000 and 5000
                pv=random.randint(1000, 5000),  # Random PV similarly
                amt=random.randint(1000, 5000),  # Random AMT
                date=current_date
            ))
        current_date += delta

    db.session.bulk_save_objects(data)
    db.session.commit()


def populate_Barchart_db():
    start_date = datetime(2023, 1, 1)  # Start date of the data generation period
    end_date = datetime(2024, 5, 9)  # End date
    delta = timedelta(days=1)  # Difference of one day
    pages = ["Page A", "Page B", "Page C", "Page D", "Page E", "Page F", "Page G"]
    data = []

    current_date = start_date
    while current_date <= end_date:
        for page in pages:
            data.append(Barchart_DataPoint(
                name=page,
                uv=random.randint(1000, 5000),  # Random UV between 1000 and 5000
                pv=random.randint(1000, 5000),  # Random PV similarly
                amt=random.randint(1000, 5000),  # Random AMT
                date=current_date
            ))
        current_date += delta

    db.session.bulk_save_objects(data)
    db.session.commit()


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
    This will recieve the word from frontend
    and call the function to find the category
    of the word from the Ps dictionary
    """
    word = request.args.get("word", "")
    if word:
        category = get_category_from_word(word)
        return jsonify({"category": category})
    else:
        return jsonify({"error": "No word provided"}), 400
'''
@app.route("/api/linechart_data")
def get_linechart_data():
    data_points = DataPoint.query.all()
    result = [
        {"name": dp.name, "uv": dp.uv, "pv": dp.pv, "amt": dp.amt}
        for dp in data_points
    ]
    return jsonify(result)
'''
@app.route("/api/linechart_data")
def get_linechart_data():
    logging.info("Received request for /api/linechart_data")
    # Optional: Get date from query parameters, format should be 'YYYY-MM-DD'
    query_date = request.args.get('date')
    
    if query_date:
        try:
            print(f"Attempting to parse date: {query_date}")
            specific_date = datetime.strptime(query_date, '%Y-%m-%d').date()
            print('specific date',specific_date)
            data_points = Linechart_DataPoint.query.filter(Linechart_DataPoint.date == specific_date).all()
            print('data_points',data_points)
        except ValueError:
            print("Date parsing failed due to ValueError")
            return jsonify({'error': 'Invalid date format, please use YYYY-MM-DD'}), 400
    else:
        # Find the latest date in the database if no date is provided
        latest_date = db.session.query(db.func.max(Linechart_DataPoint.date)).scalar()
        data_points = Linechart_DataPoint.query.filter(Linechart_DataPoint.date == latest_date).all()

    result = [
        {"name": dp.name, "uv": dp.uv, "pv": dp.pv, "amt": dp.amt}
        for dp in data_points
    ]
    print('result',result)
    return jsonify(result)




@app.route("/api/barchart_data")
def get_barchart_data():
    logging.info("Received request for /api/linechart_data")
    # Optional: Get date from query parameters, format should be 'YYYY-MM-DD'
    query_date = request.args.get('date')
    
    if query_date:
        try:
            print(f"Attempting to parse date for bar chart: {query_date}")
            specific_date = datetime.strptime(query_date, '%Y-%m-%d').date()
            print('specific date for bar chart',specific_date)
            data_points = Barchart_DataPoint.query.filter(Barchart_DataPoint.date == specific_date).all()
            print('data_points',data_points)
        except ValueError:
            print("Date parsing failed due to ValueError")
            return jsonify({'error': 'Invalid date format, please use YYYY-MM-DD'}), 400
    else:
        # Find the latest date in the database if no date is provided
        latest_date = db.session.query(db.func.max(Barchart_DataPoint.date)).scalar()
        data_points = Barchart_DataPoint.query.filter(Barchart_DataPoint.date == latest_date).all()

    result = [
        {"name": dp.name, "uv": dp.uv, "pv": dp.pv}
        for dp in data_points
    ]
    print(' bar chart result',result)
    return jsonify(result)






'''@app.route("/api/linechart_data")
def get_linechart_data():
    data = [
        {"name": "Page A", "uv": 4000, "pv": 2400, "amt": 2400},
        {"name": "Page B", "uv": 3000, "pv": 1398, "amt": 2210},
        {"name": "Page C", "uv": 2000, "pv": 9800, "amt": 2290},
        {"name": "Page D", "uv": 2780, "pv": 3908, "amt": 2000},
        {"name": "Page E", "uv": 1890, "pv": 4800, "amt": 2181},
        {"name": "Page F", "uv": 2390, "pv": 3800, "amt": 2500},
        {"name": "Page G", "uv": 3490, "pv": 4300, "amt": 2100},
    ]
    return jsonify(data)'''


'''@app.route("/api/barchart_data")
def get_barchart_data():
    data = [
        {"name": "Page A", "uv": 4000, "pv": 2400, "amt": 2400},
        {"name": "Page B", "uv": 3000, "pv": 1398, "amt": 2210},
        {"name": "Page C", "uv": 2000, "pv": 9800, "amt": 2290},
        {"name": "Page D", "uv": 2780, "pv": 3908, "amt": 2000},
        {"name": "Page E", "uv": 1890, "pv": 4800, "amt": 2181},
        {"name": "Page F", "uv": 2390, "pv": 3800, "amt": 2500},
        {"name": "Page G", "uv": 3490, "pv": 4300, "amt": 2100},
    ]
    return jsonify(data)'''

'''def populate_db():
    data = [
        DataPoint(name="Page A", uv=4000, pv=2400, amt=2400),
        DataPoint(name="Page B", uv=3000, pv=1398, amt=2210),
        DataPoint(name="Page C", uv=2000, pv=9800, amt=2290),
        DataPoint(name="Page D", uv=2780, pv=3908, amt=2000),
        DataPoint(name="Page E", uv=1890, pv=4800, amt=2181),
        DataPoint(name="Page F", uv=2390, pv=3800, amt=2500),
        DataPoint(name="Page G", uv=3490, pv=4300, amt=2100),
    ]
    db.session.bulk_save_objects(data)
    db.session.commit()'''

# Uncomment the next line to run the population script once
#populate_db()


if __name__ == "__main__":
    with app.app_context():
        create_linechart_tables()
        create_barchart_tables()
    app.run(debug=True)
