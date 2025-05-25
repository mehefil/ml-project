# ML Question Answering System

## How to Run the Application

1. **Install Python Requirements**:
   - Open Command Prompt
   - Navigate to the backend folder:
   ```bash
   cd backend
   ```
   - Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start Backend Server**:
   - In Command Prompt:
   ```bash
   python -m uvicorn main:app --reload
   ```
   - This will start the backend server on http://localhost:8000

3. **Start Frontend Server**:
   - Open a new Command Prompt
   - Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
   - Install frontend dependencies:
   ```bash
   npm install
   ```
   - Start the frontend server:
   ```bash
   npm run dev
   ```
   - This will start the frontend server on http://localhost:8080

4. **Access the Application**:
   - Open your web browser
   - Go to http://localhost:8080
   - You'll see the main interface with "Train Model" and "Ask Question" buttons

## Using the Application

1. **Train Model**:
   - Click "Train Model" button
   - Either:
     - Drag and drop your CSV file into the drop zone
     - Click "Select File" to choose a file from your computer
   - The file must be a CSV with at least two columns (features and target)

2. **Ask Questions**:
   - Click "Ask Question" button
   - Enter your question in the input field
   - Click "Ask" to get a prediction

## Requirements

- Python 3.8 or higher
- Node.js and npm (for frontend)
- A web browser

## Troubleshooting

If you encounter any errors:
1. Make sure both servers are running
2. Check if ports 8000 and 8080 are not being used by other applications
3. Ensure all dependencies are installed correctly

## Sample Data

A sample CSV file is included in the root directory. You can use this to test the application.
