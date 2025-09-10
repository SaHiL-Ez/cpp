from pymongo import MongoClient

MONGO_URI = "mongodb+srv://Vansh12345:kFcMDcJlGNmIV3kW@crop-fertilizer.sookp0j.mongodb.net/?retryWrites=true&w=majority&appName=Crop-Fertilizer"

client = MongoClient(MONGO_URI)
db = client["crop-fertilizer"]  # Database name
farmers = db["farmers"]         # Collection name