#!/bin/bash
set -e

echo "Upgrading pip, setuptools, wheel..."
pip install --upgrade pip setuptools wheel

echo "Installing Python dependencies..."
pip install --no-cache-dir -r requirements.txt

echo "Installing spaCy English model from wheel URL..."
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl

echo "Build completed successfully!"
