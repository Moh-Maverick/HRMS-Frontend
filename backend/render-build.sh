#!/bin/bash
set -e

echo "Installing system dependencies..."
apt-get update
apt-get install -y build-essential

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm

echo "Build completed successfully!"
