import fastf1 as ff1
import pandas as pd
from fastf1.core import NoLapDataError
import warnings
warnings.filterwarnings('ignore')

def fetch_f1_data(seasons):
    """
    Fetch F1 race data for given seasons and prepare dataset.
    """
    all_races = []

    for season in seasons:
        try:
            # Get all events for the season
            events = ff1.get_event_schedule(season)
            print(f"Processing season {season}...")

            for round_num in range(1, len(events) + 1):
                try:
                    # Load session data
                    session = ff1.get_session(season, round_num, 'R')
                    session.load()

                    # Get results
                    results = session.results

                    if results is not None and not results.empty:
                        for _, driver in results.iterrows():
                            race_data = {
                                'Season': season,
                                'Round': round_num,
                                'RaceName': session.event['EventName'],
                                'DriverName': driver['FullName'],
                                'TeamName': driver['TeamName'],
                                'GridPosition': driver['GridPosition'],
                                'FinalPosition': driver['Position'],
                                'Points': driver['Points']
                            }
                            all_races.append(race_data)

                except (NoLapDataError, KeyError, ValueError) as e:
                    print(f"Skipping round {round_num} in season {season}: {e}")
                    continue

        except Exception as e:
            print(f"Error processing season {season}: {e}")
            continue

    # Create DataFrame
    df = pd.DataFrame(all_races)

    # Clean data
    df = df.dropna(subset=['FinalPosition', 'GridPosition'])
    df['FinalPosition'] = pd.to_numeric(df['FinalPosition'], errors='coerce')
    df['GridPosition'] = pd.to_numeric(df['GridPosition'], errors='coerce')
    df = df.dropna()

    # Ensure consistent encoding
    df['DriverName'] = df['DriverName'].str.strip()
    df['TeamName'] = df['TeamName'].str.strip()

    return df

if __name__ == "__main__":
    seasons = list(range(2016, 2024))  # 2016 to 2023
    df = fetch_f1_data(seasons)
    df.to_csv('backend/f1_data.csv', index=False)
    print(f"Data saved to f1_data.csv with {len(df)} records")