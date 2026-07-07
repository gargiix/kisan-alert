from flask import Flask, request , jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests, os

load_dotenv()
app = Flask(__name__)
CORS(app)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

@app.route("/ping")
def ping():
    return {"status": "ok", "message": "Kisan Alert backend is alive"}

@app.route("/crop-advice", methods=["POST"])
def crop_advice():
    data = request.json  # gets JSON sent from frontend
    soil = data.get("soil")
    rainfall = data.get("rainfall")

    prompt = f"A farmer has {soil} soil and this season's rainfall is expected to be {rainfall}. Suggest one crop and explain briefly in simple language."

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}",
        json={"contents": [{"parts": [{"text": prompt}]}]}
    )

    result = response.json()
    advice_text = result["candidates"][0]["content"]["parts"][0]["text"]

    return jsonify({"advice": advice_text})

@app.route("/water-alert", methods=["POST"])
def water_alert():
    data = request.json
    soil_moisture = data.get("soil_moisture")  # a number, e.g. 20 (percent)
    days_until_rain = data.get("days_until_rain")

    if soil_moisture < 30 and days_until_rain > 2:
        message = f"Your soil is getting dry and no rain expected for {days_until_rain} days — water your field soon."
        needs_water = True
    else:
        message = "Your field's moisture looks fine for now."
        needs_water = False

    return jsonify({"needs_water": needs_water, "message": message})

import base64

@app.route("/diagnose-photo", methods=["POST"])
def diagnose_photo():
    file = request.files["photo"]
    image_bytes = file.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}",
        json={
            "contents": [{
                "parts": [
                    {"text": "This is a photo of a farmer's crop. Diagnose any visible disease or issue in simple language. If unsure, say 'uncertain'."},
                    {"inline_data": {"mime_type": "image/jpeg", "data": image_b64}}
                ]
            }]
        }
    )

    result = response.json()
    diagnosis = result["candidates"][0]["content"]["parts"][0]["text"]

    if "uncertain" in diagnosis.lower():
        return jsonify({"diagnosis": diagnosis, "forwarded_to_expert": True})
    else:
        return jsonify({"diagnosis": diagnosis, "forwarded_to_expert": False})

@app.route("/crop-suggestions", methods=["GET"])
def crop_suggestions():
    prompt = """Generate 4 realistic crop suggestions for a small farm in India for the current season.

Return ONLY valid JSON, no markdown, no explanation, in exactly this format:
[
  {"name": "crop name", "health": 90, "growthStage": "stage name", "planted": "date", "harvest": "date", "area": 30, "yield": 7.5, "color": "#f59e0b"}
]

health is 0-100. area is in acres. yield is tons per acre. Use realistic Indian crops and dates."""

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}",
        json={"contents": [{"parts": [{"text": prompt}]}]}
    )
    result = response.json()
    text = result["candidates"][0]["content"]["parts"][0]["text"]

    text = text.replace("```json", "").replace("```", "").strip()

    import json
    crops = json.loads(text)
    return jsonify(crops)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message")

    prompt = f"""You are Kisan Alert, an AI farming assistant that talks to farmers over SMS/voice call in simple language.

Rules:
- Keep replies SHORT (3-5 sentences max), like a text message, not an essay
- No markdown, no bullet points, no headers — just plain conversational text
- Give practical, direct advice specific to Indian farming conditions
- If the farmer's question is vague (like just "how is the weather"), ask ONE short clarifying question (like their location or crop) instead of giving a long generic answer
- Sound like a knowledgeable, friendly local advisor, not a corporate assistant

Farmer's message: {user_message}"""

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}",
        json={"contents": [{"parts": [{"text": prompt}]}]}
    )
    result = response.json()
    reply = result["candidates"][0]["content"]["parts"][0]["text"]
    return jsonify({"reply": reply})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)