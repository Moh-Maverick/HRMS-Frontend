#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

echo "🔹 Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

echo "🔹 Installing dependencies from requirements.txt..."
pip install -r requirements.txt --no-cache-dir --no-build-isolation

echo "🔹 Downloading spaCy model (en_core_web_sm)..."
python -m spacy download en_core_web_sm

echo "✅ Build completed successfully!"
