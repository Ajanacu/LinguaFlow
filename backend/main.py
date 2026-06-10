from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from deep_translator import GoogleTranslator

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    source: str
    target: str

@app.post("/translate")
def translate(req: TranslationRequest):

    src = req.source if req.source != "auto" else "auto"

    source = req.source if req.source != "auto" else "auto"

    translated_text = GoogleTranslator(
        source=source,
        target=req.target
    ).translate(req.text)

    return {
    "translated_text": translated_text,
    "detected_language": source
    }