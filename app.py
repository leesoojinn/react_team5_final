from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://khh:LwE8KlTJpoo7Peua@test.ohpap5n.mongodb.net/?retryWrites=true&w=majority"
)
db = client.firstweekDB


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/userinfo", methods=["POST"])
def user_post():
    dropdown1 = request.form.get("to")
    dropdown2 = request.form.get("from")
    messageTextArea = request.form.get("content")

    doc = {
        "to": dropdown1,
        "from": dropdown2,
        "content": messageTextArea,
    }
    db.userinfo.insert_one(doc)

    return jsonify({"msg": "저장 완료!"})


@app.route("/userinfo", methods=["GET"])
def userinfo_get():
    users = list(
        db.userinfo.find(
            {},
            {"_id": False},
        )
    )
    return jsonify({"users": users})


@app.route("/intro")
def get_user_introduction():
    intro = db["user introduction"].find(
        {},
        {"_id": False},
    )
    intro_list = list(intro)  # MongoDB 커서를 리스트로 변환
    return jsonify({"intro": intro_list})


if __name__ == "__main__":
    app.run("0.0.0.0", port=5001, debug=True)
