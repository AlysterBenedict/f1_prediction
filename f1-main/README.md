# F1 Prediction System

A comprehensive machine learning-powered system for predicting Formula 1 race outcomes, including podium finishes and World Drivers' Championship winners.

## 🚀 Features

- **Podium Prediction**: Predict whether a driver will finish in the Top 3 based on starting grid position, team, and historical performance
- **Championship Prediction**: Predict World Drivers' Championship winners based on season performance metrics
- **Analytics Dashboard**: Visualize driver performance, team standings, and podium frequency over seasons
- **Machine Learning Models**: Trained on 8 years of F1 data (2016-2023) using Random Forest algorithms

## 🏗️ Architecture

### Backend (Python/FastAPI)
- **Framework**: FastAPI with automatic API documentation
- **ML Models**: Scikit-learn RandomForestClassifier
- **Data**: Local CSV datasets from F1 historical data
- **Endpoints**:
  - `GET /health` - Health check
  - `POST /predict/podium` - Podium finish prediction
  - `POST /predict/wdc` - Championship winner prediction
  - Analytics endpoints for dashboard data

### Frontend (Next.js/React)
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios
- **Pages**:
  - Landing page with navigation
  - Podium prediction form
  - Championship prediction form
  - Analytics dashboard

## 📊 Machine Learning Models

### Podium Prediction Model
- **Algorithm**: RandomForestClassifier
- **Features**: driverId, constructorId, grid position
- **Target**: Binary classification (podium finish: 1/0)
- **Training Data**: Results from 2016-2023 seasons
- **Accuracy**: ~88.5%

### World Drivers' Championship Model
- **Algorithm**: RandomForestClassifier
- **Features**: year, driverId, points
- **Target**: Binary classification (champion: 1/0)
- **Training Data**: Driver standings aggregated by season
- **Accuracy**: ~98.6%

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- pip and npm

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Training Models (Optional)
If you want to retrain the models:
```bash
cd backend
python train_podium_model.py
python train_wdc_model.py
```

## 🚀 Running the Application

1. **Start Backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   Backend will be available at `http://localhost:8000`

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

3. **Access API Documentation**:
   Visit `http://localhost:8000/docs` for interactive API documentation

## 📁 Project Structure

```
f1-prediction-system/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── train_podium_model.py   # Podium model training
│   ├── train_wdc_model.py      # Championship model training
│   ├── data_acquisition.py     # Data processing script
│   ├── requirements.txt        # Python dependencies
│   └── models/                 # Trained ML models
│       ├── podium_model.joblib
│       └── wdc_model.joblib
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── podium/         # Podium prediction page
│   │   │   ├── championship/   # Championship prediction page
│   │   │   └── analytics/      # Analytics dashboard
│   │   └── ...
│   ├── package.json
│   └── ...
├── daasets/                    # F1 historical data (CSV files)
└── README.md
```

## 🎯 Usage

### Podium Prediction
1. Select a driver from the dropdown
2. Choose their constructor/team
3. Enter their starting grid position
4. Click "Predict Podium Finish"
5. View prediction results with probability and confidence

### Championship Prediction
1. Select a season year
2. Choose a driver
3. Enter their current championship points
4. Click "Predict Championship Winner"
5. View prediction results

### 2030 Championship Predictions
- View AI-powered predictions for the 2030 F1 season
- See top predicted drivers and constructors for both championships
- Includes probability scores and confidence levels

### Analytics Dashboard
- View driver performance trends over seasons
- Compare constructor team standings
- Analyze podium frequency patterns
- Browse top performers in each category

## 🤖 Model Explanation

### Podium Prediction
The model analyzes historical race data to predict Top 3 finishes. Key factors include:
- Driver's historical performance
- Constructor's car performance
- Starting grid position advantage
- Track and weather conditions (implicit in historical data)

### Championship Prediction
The championship model considers:
- Current season points accumulation
- Driver's championship-winning history
- Points gap to competitors
- Remaining races in the season

## 📈 Performance Metrics

### Podium Model
- **Accuracy**: 88.51%
- **Precision**: 52.54%
- **Recall**: 45.53%

### Championship Model
- **Accuracy**: 98.59%
- **Precision**: 69.23%
- **Recall**: 64.29%

## 🔧 API Endpoints

### Health Check
```
GET /health
Response: {"status": "service running"}
```

### Podium Prediction
```
POST /predict/podium
Body: {"driverId": 1, "constructorId": 1, "grid": 5}
Response: {
  "prediction": 1,
  "podium_probability": 0.75,
  "confidence": "high"
}
```

### Championship Prediction
```
POST /predict/wdc
Body: {"year": 2023, "driverId": 1, "points": 250}
Response: {
  "prediction": 1,
  "champion_probability": 0.85,
  "driver_name": "Max Verstappen",
  "confidence": "high"
}
```

### Analytics Data
```
GET /analytics/drivers    # Driver performance data
GET /analytics/teams      # Constructor standings
GET /analytics/podiums    # Podium frequency data
GET /drivers             # List of all drivers
GET /constructors        # List of all constructors
GET /seasons             # Available seasons
GET /predict/2030-championships    # 2030 Championship predictions
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error messages and recovery
- **Clean Interface**: Minimal, focused design for clarity
- **Interactive Charts**: Dynamic visualizations with Chart.js

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on the GitHub repository.