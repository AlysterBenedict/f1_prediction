import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
import joblib
import os

def train_podium_model():
   
    results_df = pd.read_csv('../daasets/results.csv')

 
    data = results_df[['driverId', 'constructorId', 'grid', 'positionOrder']].copy()

  
    data = data[data['positionOrder'] > 0]
    data = data.dropna()

   
    data['podium'] = (data['positionOrder'] <= 3).astype(int)

 
    X = data[['driverId', 'constructorId', 'grid']]
    y = data['podium']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train RandomForestClassifier
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print("Confusion Matrix:")
    print(conf_matrix)

    # Save the model
    os.makedirs('backend/models', exist_ok=True)
    joblib.dump(model, 'backend/models/podium_model.joblib')
    print("Model saved to backend/models/podium_model.joblib")

if __name__ == "__main__":
    train_podium_model()