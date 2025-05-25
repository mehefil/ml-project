from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
import traceback
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Global variables
model = None
data_columns = None
label_encoder = None

@app.post("/learn")
async def learn(file: UploadFile = File(...)):
    try:
        # Read CSV file
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        # Validate data
        if df.empty:
            raise ValueError("CSV file is empty")
            
        # Check if there's at least one feature column and a target column
        if len(df.columns) < 2:
            raise ValueError(f"CSV must have at least one feature column and one target column. Found columns: {df.columns.tolist()}")
            
        # Get target column
        target_col = df.columns[-1]
        
        # Encode target column if it's categorical
        if df[target_col].dtype == 'object':
            global label_encoder
            label_encoder = LabelEncoder()
            df[target_col] = label_encoder.fit_transform(df[target_col])
            
        # Prepare features and target
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]
        
        # Train model
        global model, data_columns
        model = KNeighborsClassifier(n_neighbors=3)
        model.fit(X, y)
        data_columns = X.columns.tolist()
        
        return JSONResponse(content={
            "message": "Model trained successfully",
            "features": data_columns,
            "sample_size": len(df)
        })
        
    except Exception as e:
        error_msg = str(e)
        error_msg += f"\nTraceback:\n{traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/ask")
async def ask(q: str):
    try:
        if model is None:
            raise HTTPException(status_code=400, detail="No model trained yet. Please upload a CSV file first.")
            
        # Convert query string to features
        features = [float(x) for x in q.split(',')]
        
        if len(features) != len(data_columns):
            raise HTTPException(status_code=400, detail=f"Input must have {len(data_columns)} features")
            
        # Make prediction
        prediction = model.predict([features])[0]
        
        # Convert prediction back to original label if we have a label encoder
        if label_encoder:
            prediction = label_encoder.inverse_transform([prediction])[0]
        
        return JSONResponse(content={
            "prediction": prediction,
            "features": features
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
