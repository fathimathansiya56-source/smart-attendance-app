import cv2
from deepface import DeepFace

# Open webcam
camera = cv2.VideoCapture(0)

print("Press SPACE to capture image")
print("Press ESC to exit")

while True:
    ret, frame = camera.read()

    if not ret:
        break

    cv2.imshow("Attendance Camera", frame)

    key = cv2.waitKey(1)

    # SPACE key
    if key == 32:
        cv2.imwrite("captured.jpg", frame)
        print("Image Captured!")
        break

    # ESC key
    if key == 27:
        camera.release()
        cv2.destroyAllWindows()
        exit()

camera.release()
cv2.destroyAllWindows()

print("Recognizing face...")

result = DeepFace.find(
    img_path="captured.jpg",
    db_path="dataset"
)

print(result)