import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
import joblib
import os

def train_wdc_model():
   
    standings_df = pd.read_csv('../daasets/driver_standings.csv')
    races_df = pd.read_csv('../daasets/races.csv')

  
    standings_df = standings_df.merge(races_df[['raceId', 'year']], on='raceId', how='left')

    season_points = standings_df.groupby(['year', 'driverId'])['points'].max().reset_index()


    champions = season_points.loc[season_points.groupby('year')['points'].idxmax()]

  
    season_points['is_champion'] = season_points.apply(
        lambda row: 1 if row['driverId'] in champions[champions['year'] == row['year']]['driverId'].values else 0,
        axis=1
    )

    
    X = season_points[['year', 'driverId', 'points']]
    y = season_points['is_champion']

   
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

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

    os.makedirs('backend/models', exist_ok=True)
    joblib.dump(model, 'backend/models/wdc_model.joblib')
    print("Model saved to backend/models/wdc_model.joblib")

if __name__ == "__main__":
    train_wdc_model()