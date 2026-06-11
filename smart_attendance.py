import cv2
import pandas as pd
import firebase_admin
from datetime import datetime
from deepface import DeepFace
from firebase_admin import credentials, firestore

cred = credentials.Certificate(
    "smartattendanceapp-c6173-firebase-adminsdk-fbsvc-7f8184df33.json"
)

firebase_admin.initialize_app(cred)

db = firestore.client()

camera = cv2.VideoCapture(0)

print("Press SPACE to capture attendance")
print("Press ESC to exit")

while True:
    ret, frame = camera.read()
    cv2.imshow("Smart Attendance", frame)

    key = cv2.waitKey(1)

    if key == 27:
        break

    elif key == 32:
        cv2.imwrite("captured.jpg", frame)

        print("Image Captured!")
        print("Recognizing Face...")

        result = DeepFace.find(
            img_path="captured.jpg",
            db_path="dataset"
        )

        identity = result[0].iloc[0]["identity"]

        name = identity.split("\\")[-1]
        name = name.split(".")[0]

        current_time = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

        attendance = pd.DataFrame({
            "Name": [name],
            "Time": [current_time]
        })

        attendance.to_csv(
            "attendance.csv",
            mode="a",
            header=False,
            index=False
        )
        
        db.collection("attendance").add({
    "name": name,
    "time": current_time
})

        print("Attendance Marked for:", name)

camera.release()
cv2.destroyAllWindows()