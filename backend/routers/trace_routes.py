
from fastapi import APIRouter
from ..modules import model_service, graph_builder

router = APIRouter()

@router.post("/address")
async def trace_address(address: str):
    return await model_service.predict_realworld_address(address)

@router.get("/{address}/graph")
async def get_address_graph(address: str):
    return await graph_builder.build_realworld_graph(address)

@router.get("/history")
async def get_trace_history():
    # This should query the SQLite database
    from ..database.db import get_db_connection
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT address, risk_level, illicit_prob, abuse_reports FROM addresses ORDER BY id DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "address": row[0],
            "risk_level": row[1],
            "illicit_prob": row[2],
            "abuse_reports": row[3]
        }
        for row in rows
    ]
