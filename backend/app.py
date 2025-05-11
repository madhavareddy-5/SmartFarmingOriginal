from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import requests
import werkzeug
from werkzeug.utils import secure_filename
import jwt
from datetime import datetime, timedelta
import uuid
import functools
from supabase import create_client, Client
import bcrypt
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload
app.config['JWT_SECRET'] = '/cWfXSSdH22YDb1Sia6o3z0uJZ33H+zpyy9yuVFQl2T3y2KuKM0ugY9gtKzFVe5qQfDaLt0t+alepQzcdB0n2w=='
app.config['JWT_EXPIRATION_HOURS'] = 24

# Gemini API configuration
GEMINI_API_KEY = 'AIzaSyBBbrsefWiX73VARWS2xPLd03_d72ZzmIE'
GEMINI_VISION_API_KEY = 'AIzaSyDhKf3HptsPS5tiAWSsnROFV5l-18x3Pys'
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}'
GEMINI_VISION_API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_VISION_API_KEY}'

# Create necessary directories
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Supabase configuration (from .env or directly)
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Authentication middleware
def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check if token is in the headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Decode the token
            payload = jwt.decode(token, app.config['JWT_SECRET'], algorithms=["HS256"])
            user_id = payload['sub']
            
            # Get the user from the database
            result = supabase.table("users").select("*").eq("id", user_id).single().execute()
            if result.error:
                return jsonify({'error': 'User not found'}), 404
                
            # Add user to request context
            request.user = result.data
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    first_name = data.get("firstName", "")
    last_name = data.get("lastName", "")
    preferred_language = data.get("preferredLanguage", "en")

    if not email or not username or not password:
        return jsonify({"error": "Email, username, and password are required"}), 400
    
    # Check if user already exists
    email_check = supabase.table("users").select("*").eq("email", email).execute()
    username_check = supabase.table("users").select("*").eq("username", username).execute()
    
    if email_check.data and len(email_check.data) > 0:
        return jsonify({"error": "Email already in use"}), 400
        
    if username_check.data and len(username_check.data) > 0:
        return jsonify({"error": "Username already in use"}), 400

    # Hash password before storing
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    # Prepare user data
    user_data = {
        "id": str(uuid.uuid4()),  # Generate a unique ID
        "email": email,
        "username": username,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "preferred_language": preferred_language,
        "is_admin": False,  # Default is non-admin user
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    # Insert user data into the 'users' table in Supabase
    result = supabase.table("users").insert(user_data).execute()

    if result.error:
        return jsonify({"error": result.error.message}), 400

    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Fetch the user from Supabase based on the email
    result = supabase.table("users").select("*").eq("email", email).execute()
    
    if not result.data or len(result.data) == 0:
        return jsonify({"error": "Invalid email or password"}), 401
    
    user = result.data[0]

    # Compare the provided password with the hashed password in the database
    if not bcrypt.checkpw(password.encode(), user["password"].encode()):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    token = generate_jwt(user["id"])

    # Return user data and JWT token
    return jsonify({
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "firstName": user["first_name"],
            "lastName": user["last_name"],
            "isAdmin": user["is_admin"],
            "preferredLanguage": user["preferred_language"]
        },
        "token": token
    }), 200

# JWT generation function
def generate_jwt(user_id):
    expiration = datetime.utcnow() + timedelta(hours=app.config['JWT_EXPIRATION_HOURS'])
    payload = {
        "sub": user_id,  # Subject of the token (user ID)
        "exp": expiration,
        "iat": datetime.utcnow()  # Issued at time
    }
    token = jwt.encode(payload, app.config['JWT_SECRET'], algorithm="HS256")
    return token

# Verify token endpoint (for checking if token is valid)
@app.route("/verify-token", methods=["GET"])
@token_required
def verify_token():
    return jsonify({
        "valid": True,
        "user": {
            "id": request.user["id"],
            "email": request.user["email"],
            "username": request.user["username"],
            "firstName": request.user["first_name"],
            "lastName": request.user["last_name"],
            "isAdmin": request.user["is_admin"],
            "preferredLanguage": request.user["preferred_language"]
        }
    }), 200

# User profile update endpoint
@app.route("/update-profile", methods=["PUT"])
@token_required
def update_profile():
    data = request.json
    user_id = request.user["id"]
    
    # Fields that can be updated
    allowed_fields = ["username", "first_name", "last_name", "preferred_language"]
    update_data = {}
    
    for field in allowed_fields:
        if field in data:
            # Map frontend field names to database field names
            db_field = field
            if field in ["firstName", "lastName"]:
                db_field = field.replace("firstName", "first_name").replace("lastName", "last_name")
            update_data[db_field] = data[field]
    
    # Only update if there's data to update
    if update_data:
        update_data["updated_at"] = datetime.now().isoformat()
        result = supabase.table("users").update(update_data).eq("id", user_id).execute()
        
        if result.error:
            return jsonify({"error": result.error.message}), 400
            
        # Return updated user data
        updated_user = result.data[0]
        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "id": updated_user["id"],
                "email": updated_user["email"],
                "username": updated_user["username"],
                "firstName": updated_user["first_name"],
                "lastName": updated_user["last_name"],
                "isAdmin": updated_user["is_admin"],
                "preferredLanguage": updated_user["preferred_language"]
            }
        }), 200
    
    return jsonify({"message": "No changes to update"}), 200

# Change password endpoint
@app.route("/change-password", methods=["PUT"])
@token_required
def change_password():
    data = request.json
    user_id = request.user["id"]
    
    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")
    
    if not current_password or not new_password:
        return jsonify({"error": "Current password and new password are required"}), 400
    
    # Verify current password
    if not bcrypt.checkpw(current_password.encode(), request.user["password"].encode()):
        return jsonify({"error": "Current password is incorrect"}), 401
    
    # Hash new password
    hashed_password = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
    
    # Update password in database
    update_data = {
        "password": hashed_password,
        "updated_at": datetime.now().isoformat()
    }
    
    result = supabase.table("users").update(update_data).eq("id", user_id).execute()
    
    if result.error:
        return jsonify({"error": result.error.message}), 400
        
    return jsonify({"message": "Password changed successfully"}), 200

# Helper Functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes for the frontend to access uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# The rest of your original app.py functions (chatbot, disease detection, etc.) would go here...

# Chatbot Routes
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    
    if not data or not data.get('user_input'):
        return jsonify({'message': 'User input is required'}), 400
    
    user_input = data['user_input']
    
    try:
        # Prepare the payload to send to the Gemini API
        payload = {
            "contents": [{
                "parts": [{
                    "text": user_input
                }]
            }]
        }

        # Set the headers for the request
        headers = {
            "Content-Type": "application/json"
        }

        # Send the POST request to the Gemini API
        api_response = requests.post(GEMINI_API_URL, json=payload, headers=headers)

        # Check if the request was successful
        if api_response.status_code == 200:
            # Extract the response as JSON
            result = api_response.json()

            # Extract the generated text
            if 'candidates' in result and len(result['candidates']) > 0 and \
               'content' in result['candidates'][0] and \
               'parts' in result['candidates'][0]['content'] and \
               len(result['candidates'][0]['content']['parts']) > 0 and \
               'text' in result['candidates'][0]['content']['parts'][0]:
                response_text = result['candidates'][0]['content']['parts'][0]['text']
                return jsonify({'response': response_text}), 200
            else:
                return jsonify({'message': 'Could not extract text from the API response'}), 500
        else:
            return jsonify({'message': f'API Error: {api_response.status_code} - {api_response.text}'}), 500

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

import random

# Define a set of potential disease results
DISEASES = [
    {
        "detectedDisease": "Early Blight",
        "confidence": 0.92,
        "recommendations": (
            "1. Remove affected leaves to prevent spread\n"
            "2. Apply copper-based fungicide\n"
            "3. Ensure adequate spacing between plants for better air circulation\n"
            "4. Water at the base of plants, avoid wetting the foliage\n"
            "5. Rotate crops in future plantings"
        )
    },
    {
        "detectedDisease": "Powdery Mildew",
        "confidence": 0.85,
        "recommendations": (
            "1. Prune infected leaves and stems\n"
            "2. Apply fungicide specifically for powdery mildew\n"
            "3. Improve air circulation around the plants\n"
            "4. Avoid overhead watering to reduce humidity\n"
            "5. Use resistant plant varieties if possible"
        )
    },
    {
        "detectedDisease": "Leaf Spot",
        "confidence": 0.88,
        "recommendations": (
            "1. Remove affected leaves to limit the spread\n"
            "2. Apply fungicides to control the spread of the disease\n"
            "3. Avoid wetting the foliage during watering\n"
            "4. Ensure proper spacing between plants for better air circulation"
        )
    },
    {
        "detectedDisease": "Bacterial Blight",
        "confidence": 0.80,
        "recommendations": (
            "1. Remove and dispose of infected plant parts\n"
            "2. Use copper-based bactericides for treatment\n"
            "3. Improve plant spacing to reduce humidity around plants\n"
            "4. Avoid overhead irrigation\n"
            "5. Ensure proper sanitation and clean tools after use"
        )
    },
    {
        "detectedDisease": "Downy Mildew",
        "confidence": 0.90,
        "recommendations": (
            "1. Prune infected leaves and dispose of them properly\n"
            "2. Use fungicides for mildew control\n"
            "3. Water the plants at the base to avoid wetting leaves\n"
            "4. Increase airflow around plants to reduce humidity\n"
            "5. Practice crop rotation to avoid soil-borne diseases"
        )
    },
    {
        "detectedDisease": "Fusarium Wilt",
        "confidence": 0.87,
        "recommendations": (
            "1. Remove and destroy infected plants to limit disease spread\n"
            "2. Solarize the soil or use resistant varieties\n"
            "3. Avoid over-watering, as Fusarium thrives in wet soil\n"
            "4. Practice crop rotation to prevent recurrence in future crops"
        )
    }
]

@app.route('/api/disease-detection', methods=['POST'])
def disease_detection():
    if 'uploaded_image' not in request.files:
        return jsonify({'message': 'No image uploaded'}), 400
    
    file = request.files['uploaded_image']
    
    if file.filename == '':
        return jsonify({'message': 'No image selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        user_prompt = request.form.get('user_prompt', '')
        image_description_prompt = f"You are a plant disease detection AI. Analyze this image of a plant and identify any diseases. {user_prompt}"
        
        try:
            # Select a random disease from the list
            random_disease = random.choice(DISEASES)
            
            disease_results = {
                "detectedDisease": random_disease['detectedDisease'],
                "confidence": random_disease['confidence'],
                "recommendations": random_disease['recommendations']
            }
            
            return jsonify(disease_results), 200
            
        except Exception as e:
            return jsonify({'message': f'Error during disease detection: {str(e)}'}), 500
    
    return jsonify({'message': 'Invalid file format. Only JPG, JPEG, and PNG are allowed'}), 400

# Water Prediction API Route
@app.route('/api/water-prediction', methods=['POST'])
def water_prediction():
    data = request.get_json()
    
    if not data or not data.get('cropType') or not data.get('soilType') or 'area' not in data:
        return jsonify({'message': 'Required fields missing'}), 400
    
    try:
        # In a real app, you would use actual calculations or ML models here
        # This is a simplified simulation
        crop_type = data['cropType']
        soil_type = data['soilType']
        area = float(data['area'])
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 50))
        
        # Simulate water requirements based on crop and soil type
        base_water_requirements = {
            'Rice': 15000,
            'Wheat': 6000,
            'Maize': 8000,
            'Cotton': 10000,
            'Sugarcane': 18000,
            'Potato': 5000,
            'Tomato': 7000,
            'Onion': 4000,
            'Chili': 6000,
            'Soybean': 7000
        }
        
        soil_factors = {
            'Clay': 0.8,
            'Silt': 0.9,
            'Sandy': 1.2,
            'Loamy': 1.0,
            'Clayey Loam': 0.85,
            'Silty Loam': 0.95,
            'Sandy Loam': 1.1,
            'Black Soil': 0.9,
            'Red Soil': 1.1,
            'Alluvial Soil': 1.0
        }
        
        # Calculate water requirement with temperature and humidity adjustments
        base_requirement = base_water_requirements.get(crop_type, 10000)
        soil_factor = soil_factors.get(soil_type, 1.0)
        
        # Adjust for temperature (higher temp = more water needed)
        temp_factor = 1.0 + (temperature - 25) * 0.02
        
        # Adjust for humidity (higher humidity = less water needed)
        humidity_factor = 1.0 - (humidity - 50) * 0.005
        
        # Calculate total water requirement in liters per hectare
        water_requirement_per_hectare = base_requirement * soil_factor * temp_factor * humidity_factor
        
        # Calculate total water requirement for the specified area
        total_water_requirement = water_requirement_per_hectare * area
        
        # Determine watering frequency based on crop and soil
        if crop_type in ['Rice', 'Sugarcane']:
            frequency = "Daily or maintain standing water"
        elif soil_type in ['Sandy', 'Sandy Loam']:
            frequency = "Every 2-3 days"
        else:
            frequency = "Every 4-7 days depending on weather conditions"
        
        # Generate recommendations
        recommendations = f"1. Water {crop_type} crops at early morning or evening to reduce evaporation\n"
        recommendations += f"2. Consider installing drip irrigation to optimize water usage\n"
        if soil_type in ['Sandy', 'Sandy Loam']:
            recommendations += "3. Add organic matter to improve water retention in sandy soil\n"
        if temperature > 30:
            recommendations += "4. Increase watering frequency during high temperature periods\n"
        recommendations += f"5. Monitor soil moisture regularly and adjust watering schedule as needed\n"
        
        result = {
            "cropType": crop_type,
            "soilType": soil_type,
            "area": area,
            "temperature": temperature,
            "humidity": humidity,
            "waterRequirement": round(total_water_requirement),
            "frequency": frequency,
            "recommendations": recommendations
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'message': f'Error calculating water requirements: {str(e)}'}), 500

# Fertilizer Recommendation API Route
@app.route('/api/fertilizer-recommendation', methods=['POST'])
def fertilizer_recommendation():
    data = request.get_json()
    
    if not data or not data.get('cropType') or not data.get('soilType'):
        return jsonify({'message': 'Required fields missing'}), 400
    
    try:
        # In a real app, you would use actual calculations or ML models here
        # This is a simplified simulation
        crop_type = data['cropType']
        soil_type = data['soilType']
        
        # Get current nutrient levels (or use defaults)
        current_n = float(data.get('nitrogen', 40))
        current_p = float(data.get('phosphorus', 30))
        current_k = float(data.get('potassium', 20))
        
        # Ideal nutrient requirements for different crops (N-P-K in kg/ha)
        crop_requirements = {
            'Rice': {'N': 120, 'P': 60, 'K': 60},
            'Wheat': {'N': 120, 'P': 60, 'K': 40},
            'Maize': {'N': 150, 'P': 75, 'K': 80},
            'Cotton': {'N': 160, 'P': 80, 'K': 80},
            'Sugarcane': {'N': 200, 'P': 100, 'K': 80},
            'Potato': {'N': 150, 'P': 100, 'K': 120},
            'Tomato': {'N': 100, 'P': 90, 'K': 80},
            'Onion': {'N': 110, 'P': 70, 'K': 70},
            'Chili': {'N': 120, 'P': 80, 'K': 80},
            'Soybean': {'N': 30, 'P': 80, 'K': 40}
        }
        
        # Soil type adjustment factors
        soil_adjustments = {
            'Clay': {'N': 0.9, 'P': 1.1, 'K': 0.8},
            'Silt': {'N': 1.0, 'P': 1.0, 'K': 0.9},
            'Sandy': {'N': 1.2, 'P': 0.9, 'K': 1.2},
            'Loamy': {'N': 1.0, 'P': 1.0, 'K': 1.0},
            'Clayey Loam': {'N': 0.9, 'P': 1.1, 'K': 0.9},
            'Silty Loam': {'N': 1.0, 'P': 1.0, 'K': 0.9},
            'Sandy Loam': {'N': 1.1, 'P': 0.9, 'K': 1.1},
            'Black Soil': {'N': 0.8, 'P': 1.2, 'K': 0.8},
            'Red Soil': {'N': 1.1, 'P': 0.9, 'K': 1.0},
            'Alluvial Soil': {'N': 1.0, 'P': 1.0, 'K': 1.0}
        }
        
        # Get default requirements if crop not found
        default_req = {'N': 100, 'P': 60, 'K': 60}
        requirements = crop_requirements.get(crop_type, default_req)
        
        # Get default adjustments if soil not found
        default_adj = {'N': 1.0, 'P': 1.0, 'K': 1.0}
        adjustments = soil_adjustments.get(soil_type, default_adj)
        
        # Calculate adjusted requirements
        adjusted_n = requirements['N'] * adjustments['N']
        adjusted_p = requirements['P'] * adjustments['P']
        adjusted_k = requirements['K'] * adjustments['K']
        
        # Calculate nutrient deficits
        n_deficit = max(0, adjusted_n - current_n)
        p_deficit = max(0, adjusted_p - current_p)
        k_deficit = max(0, adjusted_k - current_k)
        
        # Recommended fertilizers
        fertilizers = []
        
        if n_deficit > 0:
            fertilizers.append({
                "name": "Urea (46% Nitrogen)",
                "amount": round(n_deficit * 2.17),  # Convert to urea equivalent
                "unit": "kg/ha"
            })
        
        if p_deficit > 0:
            fertilizers.append({
                "name": "Single Super Phosphate (16% Phosphate)",
                "amount": round(p_deficit * 6.25),  # Convert to SSP equivalent
                "unit": "kg/ha"
            })
        
        if k_deficit > 0:
            fertilizers.append({
                "name": "Muriate of Potash (60% Potassium)",
                "amount": round(k_deficit * 1.67),  # Convert to MOP equivalent
                "unit": "kg/ha"
            })
        
        # Add compost recommendation
        fertilizers.append({
            "name": "Organic Compost",
            "amount": 2000,
            "unit": "kg/ha"
        })
        
        # Add NPK complex if all nutrients needed
        if n_deficit > 0 and p_deficit > 0 and k_deficit > 0:
            fertilizers.append({
                "name": "NPK 19-19-19 Complex",
                "amount": 200,
                "unit": "kg/ha"
            })
        
        # Generate recommendations
        recommendations = f"1. Apply Nitrogen fertilizers in 2-3 split doses for {crop_type}\n"
        recommendations += "2. Apply Phosphorus fertilizers at the time of sowing/planting\n"
        recommendations += "3. Apply Potassium fertilizers before flowering and fruiting stages\n"
        recommendations += "4. Incorporate organic matter into the soil before planting\n"
        
        if soil_type in ['Sandy', 'Sandy Loam']:
            recommendations += "5. Apply fertilizers in smaller, more frequent doses to prevent leaching in sandy soils\n"
        elif soil_type in ['Clay', 'Clayey Loam']:
            recommendations += "5. Improve soil drainage before applying fertilizers in clay soils\n"
        
        result = {
            "cropType": crop_type,
            "soilType": soil_type,
            "nitrogen": current_n,
            "phosphorus": current_p,
            "potassium": current_k,
            "recommendedFertilizers": fertilizers,
            "recommendations": recommendations
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'message': f'Error generating fertilizer recommendations: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)
