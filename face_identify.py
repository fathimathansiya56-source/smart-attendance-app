from deepface import DeepFace

result = DeepFace.find(
    img_path="dataset/shifana.jpeg",
    db_path="dataset"
)

print(result)