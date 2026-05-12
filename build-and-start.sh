#!/bin/bash
set -e

echo "Building frontend..."
npm --prefix frontend install
npm --prefix frontend run build

echo "Starting backend..."
cd backend
node server.js
