import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(
    "smartattendanceapp-c6173-firebase-adminsdk-fbsvc-7f8184df33.json"
)

firebase_admin.initialize_app(cred)

db = firestore.client()

db.collection("attendance").add({
    "name": "Ansiya",
    "time": "08-06-2026 14:00:00"
})

print("Data sent to Firebase successfully!")