#!/bin/bash
export PATH="/Users/tylerdiblasio/.local/bin:$PATH"
cd "$(dirname "$0")/client"
exec npx vite --port 5173
