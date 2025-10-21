#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install --upgrade pip

# Pre-install numpy before other deps
pip install numpy==1.24.4

# Now install the rest
pip install -r requirements.txt --no-build-isolation --no-cache-dir

echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm

echo "✅ Build completed successfully!"
