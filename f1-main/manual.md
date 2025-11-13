# F1 Prediction Models Manual

## Overview

This manual documents the machine learning models developed for predicting Formula 1 race outcomes, including podium finishes, World Drivers' Championship (WDC) winners, and Constructors' Championship winners. The models are built using historical F1 data and employ Random Forest classifiers for binary classification tasks.

The system consists of multiple prediction models trained on historical F1 data from the Ergast API, covering seasons from 1950 onwards. The models are deployed via a FastAPI backend and serve predictions through REST endpoints.

## Dataset

### Source
- **Primary Data Source**: Ergast F1 API historical data
- **Alternative Data Acquisition**: FastF1 library for recent seasons (2016-2023)
- **Data Format**: CSV files containing race results, driver standings, constructor standings, and related metadata

### Key Datasets Used
- `results.csv`: Race results with positions, points, grid positions, etc.
- `driver_standings.csv`: Driver championship standings by race
- `constructor_standings.csv`: Constructor championship standings by race
- `drivers.csv`: Driver information (names, dates of birth)
- `constructors.csv`: Constructor/team information
- `races.csv`: Race information (year, circuit, round)
- `circuits.csv`: Circuit information
- `qualifying.csv`: Qualifying session results

### Data Preprocessing
- Removal of invalid race positions (positionOrder <= 0)
- Handling missing values (drop or fill with 0)
- Feature aggregation per season for championship predictions
- Standardization of numerical features using StandardScaler
- Binary target creation for classification tasks

## Models

### 1. Podium Prediction Model

#### Purpose
Predicts whether a driver will finish on the podium (top 3) in a given race.

#### Model Architecture
- **Algorithm**: Random Forest Classifier (scikit-learn)
- **Type**: Binary Classification
- **Library**: sklearn.ensemble.RandomForestClassifier

#### Hyperparameters
- `n_estimators`: 100 (default)
- `random_state`: 42
- Other parameters: default sklearn values

#### Training Methodology
- **Features**: driverId, constructorId, grid (starting position)
- **Target**: podium (1 if final position ≤ 3, 0 otherwise)
- **Data Split**: 80% training, 20% testing (random_state=42)
- **Preprocessing**: Remove rows with invalid positions or missing values
- **Training Size**: All historical race results

#### Evaluation Metrics
- Accuracy
- Precision
- Recall
- Confusion Matrix

#### Results
The model's performance metrics are printed during training, including cross-validation scores and test set evaluation.

### 2. Simple WDC Prediction Model

#### Purpose
Predicts World Drivers' Championship winners based on season points.

#### Model Architecture
- **Algorithm**: Random Forest Classifier (scikit-learn)
- **Type**: Binary Classification

#### Hyperparameters
- Default sklearn RandomForestClassifier parameters
- `random_state`: 42

#### Training Methodology
- **Features**: year, driverId, points (max points per season)
- **Target**: is_champion (1 if driver has max points in season, 0 otherwise)
- **Data Split**: 80% training, 20% testing (random_state=42)
- **Preprocessing**: Aggregate driver standings by season

#### Evaluation Metrics
- Accuracy
- Precision
- Recall
- Confusion Matrix

### 3. Advanced WDC Prediction Model

#### Purpose
Advanced prediction of World Drivers' Championship winners using comprehensive driver performance features.

#### Model Architecture
- **Algorithm**: Random Forest Classifier with class balancing
- **Type**: Binary Classification

#### Hyperparameters
- `n_estimators`: 100
- `random_state`: 42
- `class_weight`: 'balanced'

#### Training Methodology
- **Features** (aggregated per season):
  - total_points: Sum of points
  - avg_points: Average points per race
  - max_points: Maximum points in a race
  - avg_position: Average finishing position
  - best_position: Best finishing position
  - avg_grid: Average grid position
  - total_laps: Total laps completed
  - avg_laps: Average laps per race
  - seasons_experience: Number of seasons raced
  - age: Driver age at season start
- **Target**: is_champion (1 if max points in season)
- **Data Split**: 80% training, 20% testing (stratified, random_state=42)
- **Preprocessing**: Feature scaling with StandardScaler, cross-validation (5-fold)
- **Class Balancing**: Addresses imbalanced dataset (few champions vs many non-champions)

#### Evaluation Metrics
- Accuracy
- Precision
- Recall
- Confusion Matrix
- Cross-validation scores (mean ± std)

### 4. Constructors' Championship Prediction Model

#### Purpose
Predicts Constructors' Championship winners.

#### Model Architecture
- **Algorithm**: Random Forest Classifier with class balancing
- **Type**: Binary Classification

#### Hyperparameters
- `n_estimators`: 100
- `random_state`: 42
- `class_weight`: 'balanced'

#### Training Methodology
- **Features** (aggregated per season):
  - total_points: Sum of points
  - avg_points: Average points per race
  - max_points: Maximum points in a race
  - avg_position: Average finishing position
  - best_position: Best finishing position
  - avg_grid: Average grid position
  - total_laps: Total laps completed
  - avg_laps: Average laps per race
  - seasons_experience: Number of seasons raced
  - num_drivers: Number of drivers per team
- **Target**: is_champion (1 if max points in season)
- **Data Split**: 80% training, 20% testing (stratified, random_state=42)
- **Preprocessing**: Feature scaling with StandardScaler, cross-validation (5-fold)
- **Class Balancing**: Addresses imbalanced dataset

#### Evaluation Metrics
- Accuracy
- Precision
- Recall
- Confusion Matrix
- Cross-validation scores (mean ± std)

## Training and Deployment

### Training Scripts
- `train_podium_model.py`: Trains podium prediction model
- `train_wdc_model.py`: Trains simple WDC model
- `train_championship_models.py`: Trains advanced WDC and Constructors models

### Model Persistence
- Models saved using joblib in `backend/models/` directory
- Scalers saved for feature standardization
- File naming: `{model_name}.joblib`, `{model_name}_scaler.joblib`

### API Endpoints
- `/predict/podium`: Podium prediction
- `/predict/wdc`: Simple WDC prediction
- `/predict/{year}/championships`: Advanced championship predictions
- `/predict/driver/{driverId}/{year}`: Driver performance prediction
- `/predict/constructor/{constructorId}/{year}`: Constructor performance prediction

### Prediction Confidence Levels
- High: probability > 0.7
- Medium: probability > 0.4
- Low: probability ≤ 0.4

## Limitations and Considerations

- Models trained on historical data; future performance may vary
- Championship predictions use 2023 data as proxy for future years
- Class imbalance handled via balanced class weights
- Feature engineering focuses on aggregated performance metrics
- No external factors (weather, tire strategy) included in current models

## Future Improvements

- Incorporate additional features (qualifying performance, pit stop data)
- Use time-series models for trend analysis
- Include external data sources (weather, track conditions)
- Implement ensemble methods for better accuracy
- Add model retraining pipeline for new season data