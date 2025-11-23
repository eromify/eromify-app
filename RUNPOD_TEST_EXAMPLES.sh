#!/bin/bash

# Runpod Image Generation - Quick Test Examples
# This file contains curl commands to test the Runpod integration locally
#
# Usage:
# 1. Update the TOKEN variable with your auth token
# 2. Make this file executable: chmod +x RUNPOD_TEST_EXAMPLES.sh
# 3. Run a specific test function: ./RUNPOD_TEST_EXAMPLES.sh test_simple
# 4. Or source it and run interactively: source RUNPOD_TEST_EXAMPLES.sh

# Configuration
BACKEND_URL="http://localhost:3001"
TOKEN="YOUR_AUTH_TOKEN_HERE"  # Replace with your actual token

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper function to make requests
make_request() {
    local name=$1
    local payload=$2
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🧪 Test: ${name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📝 Request Payload:${NC}"
    echo "$payload" | jq '.'
    echo ""
    echo -e "${YELLOW}📡 Sending request...${NC}"
    
    local start_time=$(date +%s)
    
    response=$(curl -s -X POST "${BACKEND_URL}/api/content/generate-image-runpod" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d "$payload")
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo -e "${YELLOW}⏱️  Duration: ${duration}s${NC}"
    echo -e "${YELLOW}📦 Response:${NC}"
    echo "$response" | jq '.'
    
    # Extract image URL if available
    image_url=$(echo "$response" | jq -r '.image.url // empty')
    if [ ! -z "$image_url" ]; then
        echo -e "${GREEN}✅ Success!${NC}"
        echo -e "${GREEN}🖼️  Image URL: ${image_url}${NC}"
    else
        echo -e "${RED}❌ Failed or no image URL returned${NC}"
    fi
    
    echo ""
}

# Test 1: Simple Portrait (1:1)
test_simple() {
    make_request "Simple Portrait 1:1" '{
        "prompt": "beautiful woman, professional photo, high quality, 8k",
        "aspectRatio": "1:1",
        "numInferenceSteps": 28,
        "guidanceScale": 7.5
    }'
}

# Test 2: Landscape (16:9)
test_landscape() {
    make_request "Landscape 16:9" '{
        "prompt": "stunning woman at the beach, sunset, golden hour, professional photography, cinematic",
        "aspectRatio": "16:9",
        "numInferenceSteps": 28,
        "guidanceScale": 7.5
    }'
}

# Test 3: Portrait (9:16 - Instagram/TikTok style)
test_portrait() {
    make_request "Portrait 9:16" '{
        "prompt": "attractive influencer, instagram style, fashion photo, professional lighting",
        "aspectRatio": "9:16",
        "numInferenceSteps": 30,
        "guidanceScale": 8.0
    }'
}

# Test 4: With LoRA Model
test_with_lora() {
    make_request "With LoRA Model" '{
        "prompt": "professional headshot, studio lighting, high quality",
        "aspectRatio": "2:3",
        "loraModel": "influencer_model_v1",
        "numInferenceSteps": 30,
        "guidanceScale": 8.0
    }'
}

# Test 5: With Seed (Reproducible)
test_with_seed() {
    make_request "With Seed (Reproducible)" '{
        "prompt": "beautiful woman, professional photo, high quality",
        "aspectRatio": "1:1",
        "seed": 12345,
        "numInferenceSteps": 28,
        "guidanceScale": 7.5
    }'
}

# Test 6: With Negative Prompt
test_with_negative() {
    make_request "With Negative Prompt" '{
        "prompt": "beautiful woman, professional photo, high quality, detailed",
        "aspectRatio": "1:1",
        "negativePrompt": "ugly, blurry, low quality, distorted, deformed",
        "numInferenceSteps": 28,
        "guidanceScale": 7.5
    }'
}

# Test 7: High Quality (more steps)
test_high_quality() {
    make_request "High Quality (40 steps)" '{
        "prompt": "stunning woman, professional photography, highly detailed, 8k, masterpiece",
        "aspectRatio": "1:1",
        "numInferenceSteps": 40,
        "guidanceScale": 9.0
    }'
}

# Test 8: Fast Generation (fewer steps)
test_fast() {
    make_request "Fast Generation (20 steps)" '{
        "prompt": "beautiful woman, professional photo",
        "aspectRatio": "1:1",
        "numInferenceSteps": 20,
        "guidanceScale": 7.0
    }'
}

# Test 9: Square Portrait (4:5 - Instagram Post)
test_square_portrait() {
    make_request "Square Portrait 4:5" '{
        "prompt": "fashion influencer, professional photoshoot, trendy outfit, modern aesthetic",
        "aspectRatio": "4:5",
        "numInferenceSteps": 28,
        "guidanceScale": 7.5
    }'
}

# Test 10: Ultra Wide (3:2)
test_ultra_wide() {
    make_request "Ultra Wide 3:2" '{
        "prompt": "lifestyle influencer, outdoor setting, natural lighting, professional photography",
        "aspectRatio": "3:2",
        "numInferenceSteps": 28,
        "guidanceScale": 7.5
    }'
}

# Check backend health
check_health() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🏥 Checking Backend Health${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    response=$(curl -s "${BACKEND_URL}/health")
    echo "$response" | jq '.'
    
    status=$(echo "$response" | jq -r '.status // empty')
    if [ "$status" == "OK" ]; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
    else
        echo -e "${RED}❌ Backend is not healthy${NC}"
    fi
    echo ""
}

# Run all tests
run_all_tests() {
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║         Runpod Image Generation - Test Suite            ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_health
    
    if [ "$TOKEN" == "YOUR_AUTH_TOKEN_HERE" ]; then
        echo -e "${RED}❌ Error: Please set your TOKEN in this script!${NC}"
        echo -e "${YELLOW}Update the TOKEN variable at the top of this file.${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Running all tests... (this will take a few minutes)${NC}"
    echo ""
    
    test_simple
    sleep 2
    
    test_landscape
    sleep 2
    
    test_portrait
    sleep 2
    
    test_with_seed
    sleep 2
    
    test_with_negative
    sleep 2
    
    test_square_portrait
    sleep 2
    
    test_fast
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 All tests completed!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Show help
show_help() {
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║         Runpod Image Generation - Test Examples         ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Available test functions:${NC}"
    echo ""
    echo -e "  ${GREEN}check_health${NC}         - Check if backend is running"
    echo -e "  ${GREEN}test_simple${NC}          - Simple 1:1 portrait"
    echo -e "  ${GREEN}test_landscape${NC}       - 16:9 landscape image"
    echo -e "  ${GREEN}test_portrait${NC}        - 9:16 portrait (Instagram/TikTok)"
    echo -e "  ${GREEN}test_with_lora${NC}       - Test with specific LoRA model"
    echo -e "  ${GREEN}test_with_seed${NC}       - Reproducible generation with seed"
    echo -e "  ${GREEN}test_with_negative${NC}   - Test with negative prompt"
    echo -e "  ${GREEN}test_high_quality${NC}    - High quality (40 steps)"
    echo -e "  ${GREEN}test_fast${NC}            - Fast generation (20 steps)"
    echo -e "  ${GREEN}test_square_portrait${NC} - 4:5 square portrait"
    echo -e "  ${GREEN}test_ultra_wide${NC}      - 3:2 ultra wide"
    echo -e "  ${GREEN}run_all_tests${NC}        - Run all tests"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo ""
    echo -e "  1. Update TOKEN variable in this script"
    echo -e "  2. Make executable: ${GREEN}chmod +x RUNPOD_TEST_EXAMPLES.sh${NC}"
    echo -e "  3. Run a test: ${GREEN}./RUNPOD_TEST_EXAMPLES.sh test_simple${NC}"
    echo -e "  4. Or source it: ${GREEN}source RUNPOD_TEST_EXAMPLES.sh${NC}"
    echo -e "     Then run: ${GREEN}test_simple${NC}"
    echo ""
    echo -e "${YELLOW}Example:${NC}"
    echo -e "  ${GREEN}./RUNPOD_TEST_EXAMPLES.sh run_all_tests${NC}"
    echo ""
}

# Main execution
if [ $# -eq 0 ]; then
    show_help
else
    "$@"
fi

