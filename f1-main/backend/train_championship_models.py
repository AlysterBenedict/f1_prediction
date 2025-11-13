import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
from sklearn.preprocessing import StandardScaler
import joblib
import os
import numpy as np

def load_and_preprocess_data():
    """Load and preprocess historical F1 data for championship predictions."""

   
    results_df = pd.read_csv('../daasets/results.csv')
    driver_standings_df = pd.read_csv('../daasets/driver_standings.csv')
    constructor_standings_df = pd.read_csv('../daasets/constructor_standings.csv')
    drivers_df = pd.read_csv('../daasets/drivers.csv')
    constructors_df = pd.read_csv('../daasets/constructors.csv')
    races_df = pd.read_csv('../daasets/races.csv')
    circuits_df = pd.read_csv('../daasets/circuits.csv')
    qualifying_df = pd.read_csv('../daasets/qualifying.csv')

   
    results_df = results_df[results_df['positionOrder'] > 0]
    results_df = results_df.dropna(subset=['points', 'grid', 'positionOrder'])

    results_with_race = results_df.merge(races_df[['raceId', 'year', 'circuitId']], on='raceId', how='left')

 
    results_with_race = results_with_race.merge(circuits_df[['circuitId', 'country']], on='circuitId', how='left')

    return results_with_race, driver_standings_df, constructor_standings_df, drivers_df, constructors_df, races_df, circuits_df, qualifying_df

def create_driver_features(results_with_race, driver_standings_df, drivers_df, races_df):
    """Create comprehensive driver features for WDC prediction."""

  
    driver_standings_with_year = driver_standings_df.merge(races_df[['raceId', 'year']], on='raceId', how='left')

    driver_season_stats = results_with_race.groupby(['year', 'driverId']).agg({
        'points': ['sum', 'mean', 'max'],
        'positionOrder': ['mean', 'min'],
        'grid': ['mean'],
        'laps': ['sum', 'mean']
    }).reset_index()

  
    driver_season_stats.columns = ['year', 'driverId', 'total_points', 'avg_points', 'max_points',
                                   'avg_position', 'best_position', 'avg_grid', 'total_laps', 'avg_laps']

 
    driver_experience = results_with_race.groupby('driverId')['year'].nunique().reset_index()
    driver_experience.columns = ['driverId', 'seasons_experience']

  
    driver_age = drivers_df[['driverId', 'dob']].merge(
        results_with_race[['driverId', 'year']].drop_duplicates(),
        on='driverId', how='right'
    )
    driver_age['dob'] = pd.to_datetime(driver_age['dob'])
    driver_age['age'] = driver_age['year'] - driver_age['dob'].dt.year
    driver_age = driver_age[['driverId', 'year', 'age']]

  
    driver_features = driver_season_stats.merge(driver_experience, on='driverId', how='left')
    driver_features = driver_features.merge(driver_age, on=['driverId', 'year'], how='left')


    driver_features = driver_features.fillna(0)

  
    season_max_points = driver_standings_with_year.groupby('year')['points'].max().reset_index()

    season_champions = season_max_points.merge(
        driver_standings_with_year[['year', 'points', 'driverId']],
        on=['year', 'points'],
        how='left'
    ).drop_duplicates(subset=['year'])

    season_champions['is_champion'] = 1

   
    driver_features = driver_features.merge(
        season_champions[['year', 'driverId', 'is_champion']],
        on=['year', 'driverId'],
        how='left'
    )
    driver_features['is_champion'] = driver_features['is_champion'].fillna(0)

    return driver_features

def create_constructor_features(results_with_race, constructor_standings_df, constructors_df):
    """Create comprehensive constructor features for Constructors' Championship prediction."""

   
    constructor_standings_with_year = constructor_standings_df.merge(
        results_with_race[['raceId', 'year']].drop_duplicates(),
        left_on='raceId', right_on='raceId', how='left'
    )

   
    constructor_season_stats = results_with_race.groupby(['year', 'constructorId']).agg({
        'points': ['sum', 'mean', 'max'],
        'positionOrder': ['mean', 'min'],
        'grid': ['mean'],
        'laps': ['sum', 'mean']
    }).reset_index()

   
    constructor_season_stats.columns = ['year', 'constructorId', 'total_points', 'avg_points', 'max_points',
                                        'avg_position', 'best_position', 'avg_grid', 'total_laps', 'avg_laps']

  
    constructor_experience = results_with_race.groupby('constructorId')['year'].nunique().reset_index()
    constructor_experience.columns = ['constructorId', 'seasons_experience']

   
    drivers_per_team = results_with_race.groupby(['year', 'constructorId'])['driverId'].nunique().reset_index()
    drivers_per_team.columns = ['year', 'constructorId', 'num_drivers']

   
    constructor_features = constructor_season_stats.merge(constructor_experience, on='constructorId', how='left')
    constructor_features = constructor_features.merge(drivers_per_team, on=['year', 'constructorId'], how='left')

    # Fill missing values
    constructor_features = constructor_features.fillna(0)

    # Determine Constructors' Championship winners - get max points per season
    season_max_points = constructor_standings_with_year.groupby('year')['points'].max().reset_index()

    season_constructor_champions = season_max_points.merge(
        constructor_standings_with_year[['year', 'points', 'constructorId']],
        on=['year', 'points'],
        how='left'
    ).drop_duplicates(subset=['year'])

    season_constructor_champions['is_champion'] = 1

    # Merge target variable
    constructor_features = constructor_features.merge(
        season_constructor_champions[['year', 'constructorId', 'is_champion']],
        on=['year', 'constructorId'],
        how='left'
    )
    constructor_features['is_champion'] = constructor_features['is_champion'].fillna(0)

    return constructor_features

def train_wdc_model():
    """Train World Drivers' Championship prediction model."""

    # Load and preprocess data
    data = load_and_preprocess_data()
    results_with_race, driver_standings_df, constructor_standings_df, drivers_df, constructors_df, races_df, circuits_df, qualifying_df = data

    # Create driver features
    driver_features = create_driver_features(results_with_race, driver_standings_df, drivers_df, races_df)

    # Prepare features and target
    feature_cols = ['total_points', 'avg_points', 'max_points', 'avg_position', 'best_position',
                    'avg_grid', 'total_laps', 'avg_laps', 'seasons_experience', 'age']

    X = driver_features[feature_cols]
    y = driver_features['is_champion']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

    # Train RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    # Cross-validation
    cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='accuracy')

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    print("=== World Drivers' Championship Model ===")
    print(f"Cross-validation accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    print(f"Test accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print("Confusion Matrix:")
    print(conf_matrix)

    # Save the model and scaler
    os.makedirs('backend/models', exist_ok=True)
    joblib.dump(model, 'backend/models/wdc_model.joblib')
    joblib.dump(scaler, 'backend/models/wdc_scaler.joblib')
    print("WDC model and scaler saved")

    return model, scaler, feature_cols

def train_constructors_model():
    """Train Constructors' Championship prediction model."""

    # Load and preprocess data
    data = load_and_preprocess_data()
    results_with_race, driver_standings_df, constructor_standings_df, drivers_df, constructors_df, races_df, circuits_df, qualifying_df = data

    # Create constructor features
    constructor_features = create_constructor_features(results_with_race, constructor_standings_df, constructors_df)

    # Prepare features and target
    feature_cols = ['total_points', 'avg_points', 'max_points', 'avg_position', 'best_position',
                    'avg_grid', 'total_laps', 'avg_laps', 'seasons_experience', 'num_drivers']

    X = constructor_features[feature_cols]
    y = constructor_features['is_champion']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

    # Train RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    # Cross-validation
    cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='accuracy')

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    print("=== Constructors' Championship Model ===")
    print(f"Cross-validation accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    print(f"Test accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print("Confusion Matrix:")
    print(conf_matrix)

    # Save the model and scaler
    os.makedirs('backend/models', exist_ok=True)
    joblib.dump(model, 'backend/models/constructors_model.joblib')
    joblib.dump(scaler, 'backend/models/constructors_scaler.joblib')
    print("Constructors' model and scaler saved")

    return model, scaler, feature_cols

def predict_championships(year: int):
    """Generate predictions for championships for a given year."""

    # Load models and scalers
    wdc_model = joblib.load('backend/models/wdc_model.joblib')
    wdc_scaler = joblib.load('backend/models/wdc_scaler.joblib')
    constructors_model = joblib.load('backend/models/constructors_model.joblib')
    constructors_scaler = joblib.load('backend/models/constructors_scaler.joblib')

    # Load data
    data = load_and_preprocess_data()
    results_with_race, driver_standings_df, constructor_standings_df, drivers_df, constructors_df, races_df, circuits_df, qualifying_df = data

    # Create driver features for the specified year (using 2023 data as proxy)
    driver_features_2023 = create_driver_features(results_with_race, driver_standings_df, drivers_df, races_df)
    driver_features_year = driver_features_2023[driver_features_2023['year'] == 2023].copy()
    driver_features_year['year'] = year

    # Create constructor features for the specified year
    constructor_features_2023 = create_constructor_features(results_with_race, constructor_standings_df, constructors_df)
    constructor_features_year = constructor_features_2023[constructor_features_2023['year'] == 2023].copy()
    constructor_features_year['year'] = year

    # WDC Features
    wdc_feature_cols = ['total_points', 'avg_points', 'max_points', 'avg_position', 'best_position',
                        'avg_grid', 'total_laps', 'avg_laps', 'seasons_experience', 'age']
    X_wdc_year = driver_features_year[wdc_feature_cols]
    X_wdc_year_scaled = wdc_scaler.transform(X_wdc_year)

    # Constructors' Features
    constructors_feature_cols = ['total_points', 'avg_points', 'max_points', 'avg_position', 'best_position',
                                 'avg_grid', 'total_laps', 'avg_laps', 'seasons_experience', 'num_drivers']
    X_constructors_year = constructor_features_year[constructors_feature_cols]
    X_constructors_year_scaled = constructors_scaler.transform(X_constructors_year)

    # Make predictions
    wdc_predictions = wdc_model.predict(X_wdc_year_scaled)
    wdc_probabilities = wdc_model.predict_proba(X_wdc_year_scaled)

    constructors_predictions = constructors_model.predict(X_constructors_year_scaled)
    constructors_probabilities = constructors_model.predict_proba(X_constructors_year_scaled)

    # Get driver and constructor names
    driver_names = drivers_df.set_index('driverId')[['forename', 'surname']].apply(lambda x: f"{x['forename']} {x['surname']}", axis=1)
    constructor_names = constructors_df.set_index('constructorId')['name']

    # WDC Results
    wdc_results = []
    for i, (idx, row) in enumerate(driver_features_year.iterrows()):
        driver_id = int(row['driverId'])
        driver_name = driver_names.get(driver_id, f"Driver {driver_id}")
        prob_champion = wdc_probabilities[i][1]
        wdc_results.append({
            'driver_id': driver_id,
            'driver_name': driver_name,
            'predicted_champion': bool(wdc_predictions[i]),
            'champion_probability': float(prob_champion),
            'confidence': 'high' if prob_champion > 0.7 else 'medium' if prob_champion > 0.4 else 'low'
        })

    # Sort by probability
    wdc_results.sort(key=lambda x: x['champion_probability'], reverse=True)

    # Constructors' Results
    constructors_results = []
    for i, (idx, row) in enumerate(constructor_features_year.iterrows()):
        constructor_id = int(row['constructorId'])
        constructor_name = constructor_names.get(constructor_id, f"Constructor {constructor_id}")
        prob_champion = constructors_probabilities[i][1]
        constructors_results.append({
            'constructor_id': constructor_id,
            'constructor_name': constructor_name,
            'predicted_champion': bool(constructors_predictions[i]),
            'champion_probability': float(prob_champion),
            'confidence': 'high' if prob_champion > 0.7 else 'medium' if prob_champion > 0.4 else 'low'
        })

    # Sort by probability
    constructors_results.sort(key=lambda x: x['champion_probability'], reverse=True)

    return wdc_results, constructors_results

if __name__ == "__main__":
    print("Training World Drivers' Championship model...")
    train_wdc_model()

    print("\nTraining Constructors' Championship model...")
    train_constructors_model()

    print("\nGenerating 2030 predictions...")
    wdc_preds, constructors_preds = predict_championships(2030)

    print("\n=== 2030 World Drivers' Championship Predictions ===")
    for pred in wdc_preds[:5]:  # Top 5
        print(f"{pred['driver_name']}: {pred['champion_probability']:.3f} ({pred['confidence']})")

    print("\n=== 2030 Constructors' Championship Predictions ===")
    for pred in constructors_preds[:5]:  # Top 5
        print(f"{pred['constructor_name']}: {pred['champion_probability']:.3f} ({pred['confidence']})")