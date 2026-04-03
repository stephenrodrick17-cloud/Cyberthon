# Cyberthon: AI-Powered Blockchain Forensics Platform

An advanced blockchain analysis and forensics platform that combines machine learning, graph theory, and real-time data to identify and trace illicit cryptocurrency activities.

## 🚀 Overview

Cyberthon is designed for law enforcement, financial institutions, and security researchers to investigate the Bitcoin ecosystem. It leverages the **Elliptic Data Set**—the largest labeled transaction dataset in the crypto-sphere—alongside real-time blockchain APIs to provide actionable intelligence on money laundering, ransomware, and other cybercrimes.

### Key Capabilities:
- **Illicit Activity Prediction**: Uses Random Forest and XGBoost models to classify transactions as 'licit' or 'illicit'.
- **Graph Visualization**: Interactive 2D/3D visualization of transaction flows and address relationships.
- **Address Tracing**: Real-time tracing of Bitcoin addresses with integration to the Bitcoin Abuse database.
- **Cluster Analysis**: Automatic identification of entity clusters (Mixers, Exchanges, Ransomware) using the Common Input Ownership heuristic.
- **Forensic Reporting**: Generates detailed PDF reports of suspicious activities and identified clusters.

---

## 🏗️ Architecture

The platform follows a modern decoupled architecture:

### Backend (Python/FastAPI)
- **FastAPI**: High-performance REST API.
- **Machine Learning**: Scikit-learn (Random Forest) and XGBoost for transaction classification.
- **Graph Analysis**: NetworkX for building subgraphs and identifying clusters.
- **Data Processing**: Pandas and NumPy for handling large-scale transaction datasets.
- **Database**: SQLite for persistent storage of identified risks and reports.

### Frontend (React/Vite)
- **React 19**: Responsive and interactive UI.
- **Cytoscape.js**: Powerful graph visualization engine.
- **Tailwind CSS**: Modern utility-first styling.
- **Framer Motion**: Smooth UI transitions and animations.
- **Zustand**: Lightweight state management.

---

## 📂 Project Structure

```text
├── backend/
│   ├── data/               # Dataset CSVs (Elliptic Data Set)
│   ├── database/           # SQLite models and connection logic
│   ├── models/             # Trained ML models (.pkl, .npy)
│   ├── modules/            # Core logic (ML service, APIs, Graph builder)
│   ├── routers/            # API endpoints
│   └── main.py             # Backend entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (Navbar, StatCards)
│   │   ├── pages/          # Application views (Dashboard, Tracer, etc.)
│   │   └── api.js          # API client
│   └── ...                 # Vite configuration
└── .gitignore              # Project-wide git exclusions
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- [Bitcoin Abuse API Key](https://www.bitcoinabuse.com/api-docs) (Optional)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Create a `.env` file for API keys:
   ```text
   BITCOIN_ABUSE_KEY=your_api_key_here
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📊 Dataset Information

This platform primarily uses the **Elliptic Data Set**, which consists of:
- **203,769 node transactions**
- **234,355 directed edges** (payment flows)
- **166 features** per transaction (local and structural features)
- **Class labels**: Illicit (1), Licit (2), and Unknown.

*Note: Large dataset files in `backend/data/` are excluded from the repository. You can download them from [Kaggle](https://www.kaggle.com/datasets/ellipticco/elliptic-data-set).*

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/stephenrodrick17-cloud/Cyberthon) on GitHub for details.

---

## 👥 Contributors

- **Stephen Rodrick** - *Initial Work* - [stephenrodrick17-cloud](https://github.com/stephenrodrick17-cloud)
