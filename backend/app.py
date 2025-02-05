from flask import Flask, jsonify, request
import os
import sqlite3

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, world!"

@app.route("/loadKanji", methods=["POST"])
def load_kanji():

    CSV_PATH = os.path.join("..", "data")

    level = request.json.get("level")
    startIdx = request.json.get("startIdx")
    endIdx = request.json.get("endIdx")
    num_kanji = int(request.json.get("numKanji"))
    randomize = request.json.get("randomize")
    custom_kanji_list = request.json.get("fileContent")

    print(custom_kanji_list)

    if custom_kanji_list == "":
        with open(os.path.join(CSV_PATH, f"{level}.csv"), "r", encoding="UTF-8") as f:
            data = f.read().splitlines()

    kanji_list = []
    missing_kanji = []

    conn = sqlite3.connect("../db/database.db")
    conn.row_factory = sqlite3.Row

    if endIdx == -1:
        endIdx = len(data) - 1

    for kanji in data[startIdx:endIdx + 1]:
        res = conn.execute(r'SELECT * from characters where character = ?;', (kanji,)).fetchone()

        if res:
            kanji_list.append((dict(res)))
        else:
            missing_kanji.append(kanji)

    if randomize:
        import random
        random.shuffle(kanji_list)

    if missing_kanji:
        return jsonify({
            "message": "The following kanji were missing...",
            "missingKanji": missing_kanji
        }), 400

    if num_kanji != 0 and num_kanji < len(kanji_list):
        kanji_list = kanji_list[:num_kanji]

    return jsonify({
        "kanjiList": kanji_list
    }), 200


if __name__ == "__main__":
    app.run(debug=True)