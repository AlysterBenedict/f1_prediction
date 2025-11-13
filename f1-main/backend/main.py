from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="F1 Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
podium_model = joblib.load('backend/models/podium_model.joblib')
wdc_model = joblib.load('backend/models/wdc_model.joblib')
constructors_model = joblib.load('backend/models/constructors_model.joblib')
wdc_scaler = joblib.load('backend/models/wdc_scaler.joblib')
constructors_scaler = joblib.load('backend/models/constructors_scaler.joblib')

# Load data for analytics
results_df = pd.read_csv('../daasets/results.csv')
drivers_df = pd.read_csv('../daasets/drivers.csv')
constructors_df = pd.read_csv('../daasets/constructors.csv')
races_df = pd.read_csv('../daasets/races.csv')

class PodiumPredictionRequest(BaseModel):
    driverId: int
    constructorId: int
    grid: int

class WDCPredictionRequest(BaseModel):
    year: int
    driverId: int
    points: float

@app.get("/health")
async def health_check():
    return {"status": "service running"}

@app.post("/predict/podium")
async def predict_podium(request: PodiumPredictionRequest):
    try:
        # Prepare input data
        input_data = pd.DataFrame([{
            'driverId': request.driverId,
            'constructorId': request.constructorId,
            'grid': request.grid
        }])

        # Make prediction
        prediction = podium_model.predict(input_data)[0]
        probabilities = podium_model.predict_proba(input_data)[0]

        # Get probability of podium (class 1)
        podium_probability = float(probabilities[1])

        return {
            "prediction": int(prediction),
            "podium_probability": podium_probability,
            "confidence": "high" if podium_probability > 0.7 else "medium" if podium_probability > 0.4 else "low"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/wdc")
async def predict_wdc(request: WDCPredictionRequest):
    try:
        # Prepare input data
        input_data = pd.DataFrame([{
            'year': request.year,
            'driverId': request.driverId,
            'points': request.points
        }])

        # Make prediction
        prediction = wdc_model.predict(input_data)[0]
        probabilities = wdc_model.predict_proba(input_data)[0]

        # Get probability of being champion (class 1)
        champion_probability = float(probabilities[1])

        # Get driver name
        driver_name = drivers_df[drivers_df['driverId'] == request.driverId]['forename'].iloc[0] + " " + \
                     drivers_df[drivers_df['driverId'] == request.driverId]['surname'].iloc[0]

        return {
            "prediction": int(prediction),
            "champion_probability": champion_probability,
            "driver_name": driver_name,
            "confidence": "high" if champion_probability > 0.7 else "medium" if champion_probability > 0.4 else "low"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/drivers")
async def get_driver_performance(driverId: int = None):
    # Merge results with drivers and races
    merged = results_df.merge(drivers_df[['driverId', 'forename', 'surname']], on='driverId') \
                        .merge(races_df[['raceId', 'year']], on='raceId')

    if driverId:
        merged = merged[merged['driverId'] == driverId]

    # Calculate average points per season for each driver
    driver_performance = merged.groupby(['year', 'driverId', 'forename', 'surname'])['points'].mean().reset_index()
    driver_performance['driver_name'] = driver_performance['forename'] + " " + driver_performance['surname']

    return driver_performance.to_dict('records')

@app.get("/analytics/teams")
async def get_team_standings(constructorId: int = None):
    # Merge results with constructors and races
    merged = results_df.merge(constructors_df[['constructorId', 'name']], on='constructorId') \
                        .merge(races_df[['raceId', 'year']], on='raceId')

    if constructorId:
        merged = merged[merged['constructorId'] == constructorId]

    # Calculate total points per season for each team
    team_standings = merged.groupby(['year', 'constructorId', 'name'])['points'].sum().reset_index()

    return team_standings.to_dict('records')

@app.get("/analytics/podiums")
async def get_podium_frequency(driverId: int = None):
    # Filter podium finishes
    podiums = results_df[results_df['positionOrder'] <= 3].copy()

    # Merge with drivers and races
    merged = podiums.merge(drivers_df[['driverId', 'forename', 'surname']], on='driverId') \
                    .merge(races_df[['raceId', 'year']], on='raceId')

    if driverId:
        merged = merged[merged['driverId'] == driverId]

    # Count podiums per driver per season
    podium_count = merged.groupby(['year', 'driverId', 'forename', 'surname']).size().reset_index(name='podiums')
    podium_count['driver_name'] = podium_count['forename'] + " " + podium_count['surname']

    return podium_count.to_dict('records')

@app.get("/drivers")
async def get_drivers():
    # Filter for drivers active in the last 5 years (2020-2024)
    active_years = [2020, 2021, 2022, 2023, 2024]
    active_races = races_df[races_df['year'].isin(active_years)]['raceId']
    active_driver_ids = results_df[results_df['raceId'].isin(active_races)]['driverId'].unique()

    drivers = drivers_df[drivers_df['driverId'].isin(active_driver_ids)][['driverId', 'forename', 'surname']].copy()
    drivers['name'] = drivers['forename'] + " " + drivers['surname']
    return drivers[['driverId', 'name']].to_dict('records')

@app.get("/constructors")
async def get_constructors():
    # Filter for constructors active in the last 5 years (2020-2024)
    active_years = [2020, 2021, 2022, 2023, 2024]
    active_races = races_df[races_df['year'].isin(active_years)]['raceId']
    active_constructor_ids = results_df[results_df['raceId'].isin(active_races)]['constructorId'].unique()

    constructors = constructors_df[constructors_df['constructorId'].isin(active_constructor_ids)]
    return constructors[['constructorId', 'name']].to_dict('records')

@app.get("/seasons")
async def get_seasons():
    seasons = races_df['year'].unique()
    return sorted(seasons.tolist(), reverse=True)

@app.get("/predict/{year}/championships")
async def predict_championships(year: int):
    """Predict World Drivers' and Constructors' Championship winners for a given year."""
    try:
        # Import the prediction function
        from train_championship_models import predict_championships

        wdc_predictions, constructors_predictions = predict_championships(year)

        return {
            "world_drivers_championship": {
                "predictions": wdc_predictions,
                "top_prediction": wdc_predictions[0] if wdc_predictions else None
            },
            "constructors_championship": {
                "predictions": constructors_predictions,
                "top_prediction": constructors_predictions[0] if constructors_predictions else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/driver/{driverId}/{year}")
async def predict_driver_performance(driverId: int, year: int):
    """Predict driver performance for a given year."""
    try:
        # Get driver name
        driver_info = drivers_df[drivers_df['driverId'] == driverId]
        if driver_info.empty:
            raise HTTPException(status_code=404, detail="Driver not found")

        driver_name = f"{driver_info['forename'].iloc[0]} {driver_info['surname'].iloc[0]}"

        # Get recent performance data for prediction
        recent_results = results_df.merge(races_df[['raceId', 'year']], on='raceId')
        recent_results = recent_results[(recent_results['driverId'] == driverId) &
                                       (recent_results['year'] >= year - 3) &
                                       (recent_results['year'] < year)]

        if recent_results.empty:
            return {
                "driver_name": driver_name,
                "predictions": {
                    "points": 0,
                    "podium_probability": 0.0,
                    "championship_probability": 0.0
                },
                "confidence": "low",
                "note": "Insufficient historical data"
            }

        # Calculate recent performance metrics
        avg_points = recent_results['points'].mean()
        podium_count = len(recent_results[recent_results['positionOrder'] <= 3])
        total_races = len(recent_results)

        # Simple prediction based on recent performance
        predicted_points = max(0, avg_points * 0.9)  # Slight regression to mean
        podium_probability = min(0.8, podium_count / max(1, total_races) * 1.2)

        # Championship prediction (simplified)
        championship_probability = podium_probability * 0.3 if predicted_points > 200 else 0.0

        return {
            "driver_name": driver_name,
            "predictions": {
                "points": round(predicted_points, 1),
                "podium_probability": round(podium_probability, 3),
                "championship_probability": round(championship_probability, 3)
            },
            "confidence": "medium" if total_races >= 10 else "low",
            "based_on_races": total_races
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/constructor/{constructorId}/{year}")
async def predict_constructor_performance(constructorId: int, year: int):
    """Predict constructor performance for a given year."""
    try:
        # Get constructor name
        constructor_info = constructors_df[constructors_df['constructorId'] == constructorId]
        if constructor_info.empty:
            raise HTTPException(status_code=404, detail="Constructor not found")

        constructor_name = constructor_info['name'].iloc[0]

        # Get recent performance data for prediction
        recent_results = results_df.merge(races_df[['raceId', 'year']], on='raceId')
        recent_results = recent_results[(recent_results['constructorId'] == constructorId) &
                                       (recent_results['year'] >= year - 3) &
                                       (recent_results['year'] < year)]

        if recent_results.empty:
            return {
                "constructor_name": constructor_name,
                "predictions": {
                    "points": 0,
                    "championship_probability": 0.0
                },
                "confidence": "low",
                "note": "Insufficient historical data"
            }

        # Calculate recent performance metrics
        total_points = recent_results.groupby('year')['points'].sum().mean()

        # Simple prediction based on recent performance
        predicted_points = max(0, total_points * 0.9)  # Slight regression to mean

        # Championship prediction (simplified)
        championship_probability = 0.4 if predicted_points > 400 else 0.1 if predicted_points > 200 else 0.0

        return {
            "constructor_name": constructor_name,
            "predictions": {
                "points": round(predicted_points, 1),
                "championship_probability": round(championship_probability, 3)
            },
            "confidence": "medium",
            "based_on_seasons": len(recent_results.groupby('year'))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))