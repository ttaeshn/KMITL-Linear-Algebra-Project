import numpy as np
import pandas as pd
import os

path_to_repo = r'C:\Users\taesh\Work\Linea-Algebra-Project'

# Target folder name
target_folder = 'papaya_image'

for dirname, _, filenames in os.walk(path_to_repo):
    if target_folder in dirname:
        print(f"Accessing directory: {dirname}")
        for filename in filenames:
            print(os.path.join(dirname, filename))

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import io
import cv2
import matplotlib.pyplot as plt
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

app = FastAPI()

#loading images
def load_images_from_folder(folder, label, size=(64, 64)):
    images = []
    labels = []
    for filename in os.listdir(folder):
        img_path = os.path.join(folder, filename)
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        if img is not None:
            img = cv2.resize(img, size)
            print("Loaded image shape:", img.shape)  # Check image shape
            images.append(img.flatten())
            labels.append(label)
    return images, labels

#loading datasets
def load_dataset(base_path):
    categories = os.listdir(base_path)
    print("Categories:", categories)  # Print categories to verify
    X = []
    y = []
    for label, category in enumerate(categories):
        folder = os.path.join(base_path, category)
        images, labels = load_images_from_folder(folder, label)
        X.extend(images)
        y.extend(labels)
    return np.array(X), np.array(y), categories

def show_sample_images(images, labels, categories, num_samples=5):
    plt.figure(figsize=(10, 10))
    for i in range(num_samples):
        plt.subplot(1, num_samples, i + 1)
        plt.imshow(images[i].reshape(64, 64))
        plt.title(categories[labels[i]])
        plt.axis('off')
    plt.show()

base_path = 'C:\\Users\\taesh\\Work\\Linea-Algebra-Project\\papaya_image'
X, y, categories = load_dataset(base_path)
# print(X, y, categories)
print("Number of samples:", len(X))  
show_sample_images(X, y, categories)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = make_pipeline(StandardScaler(), svm.SVC(kernel='linear'))
pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)

print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=categories))

# conf_matrix = confusion_matrix(y_test, y_pred)

# plt.figure(figsize=(10, 7))
# sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=categories, yticklabels=categories)
# plt.xlabel('Predicted')
# plt.ylabel('Actual')
# plt.title('Confusion Matrix')
# plt.show()

# accuracy = pipeline.score(X_test, y_test)
# print(f"Accuracy: {accuracy * 100:.2f}%")


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents))

    img = img.convert('L')  
    img = img.resize((64, 64))  
    img_array = np.array(img).flatten()  

    img_array = img_array.reshape(1, -1)

    # Perform the classification
    prediction = pipeline.predict(img_array)
    predicted_category = categories[prediction[0]]

    # Determine if the result is suitable for papaya salad
    if predicted_category in ['unmature', 'partiallymature']:
        message = "can do papaya salad"
    else:
        message = "can't do papaya salad"

    # Return the classification result and the message
    return JSONResponse(content={"label": predicted_category, "message": message})