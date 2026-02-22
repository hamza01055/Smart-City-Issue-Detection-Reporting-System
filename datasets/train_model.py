import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

data = pd.read_csv("../datasets/traffic_data.csv")

X = data.drop("congestion", axis=1)
y = data["congestion"]

model = RandomForestRegressor()
model.fit(X, y)

joblib.dump(model, "../models/traffic_model.pkl")

print("Model trained and saved.")