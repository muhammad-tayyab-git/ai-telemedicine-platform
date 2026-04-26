#!/bin/bash

# ─── Colors for output ────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080/api"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       AI Telemedicine Platform — Symptom Test Script         ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ─── Step 1: Register a test patient ─────────────────────────────────────────
echo -e "${BLUE}[Step 1]${NC} Registering test patient..."

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tayyab.test@telemedicine.com",
    "password": "testpass123",
    "firstName": "Tayyab",
    "lastName": "Muhammad",
    "role": "PATIENT"
  }')

echo "Response: $REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"

# Extract token from register response
TOKEN=$(echo $REGISTER_RESPONSE | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data['data']['token'])
except:
    print('')
" 2>/dev/null)

# ─── If already registered, login instead ─────────────────────────────────────
if [ -z "$TOKEN" ]; then
  echo ""
  echo -e "${YELLOW}[Info]${NC} Email already registered. Logging in instead..."

  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "tayyab.test@telemedicine.com",
      "password": "testpass123"
    }')

  echo "Response: $LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"

  TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data['data']['token'])
except:
    print('')
" 2>/dev/null)
fi

# ─── Check token was obtained ─────────────────────────────────────────────────
if [ -z "$TOKEN" ]; then
  echo -e "${RED}[Error]${NC} Could not obtain JWT token. Is the backend running on port 8080?"
  echo "Check: curl http://localhost:8080/actuator/health"
  exit 1
fi

echo ""
echo -e "${GREEN}[✓]${NC} Logged in successfully."
echo -e "    Token: ${TOKEN:0:40}..."

# ─── Step 2: Submit eye + flu symptoms ────────────────────────────────────────
echo ""
echo -e "${BLUE}[Step 2]${NC} Submitting symptoms for AI triage analysis..."
echo ""
echo -e "    Symptoms: ${YELLOW}\"I have irritation in my eyes, my eyes are red, swollen"
echo -e "    and watering. I also have flu symptoms including runny nose,"
echo -e "    sore throat, sneezing and mild fever for the past 2 days.\"${NC}"
echo ""

SYMPTOM_RESPONSE=$(curl -s -X POST "$BASE_URL/symptoms/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "symptoms": "I have irritation in my eyes, my eyes are red, swollen and watering. I also have flu symptoms including runny nose, sore throat, sneezing and mild fever for the past 2 days. My eyes feel very itchy and uncomfortable, especially in bright light."
  }')

# ─── Step 3: Display formatted result ────────────────────────────────────────
echo -e "${BLUE}[Step 3]${NC} AI Triage Result:"
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

echo $SYMPTOM_RESPONSE | python3 -c "
import sys, json

try:
    raw = sys.stdin.read()
    data = json.loads(raw)
    result = data.get('data', {})

    condition  = result.get('predictedCondition', 'N/A')
    severity   = result.get('severityLevel', 'N/A')
    confidence = result.get('confidenceScore', 0)
    rec        = result.get('recommendation', 'N/A')
    status     = result.get('status', 'N/A')

    severity_colors = {
        'LOW':      '\033[0;32m',
        'MEDIUM':   '\033[1;33m',
        'HIGH':     '\033[0;31m',
        'CRITICAL': '\033[1;31m',
    }
    color = severity_colors.get(severity.upper(), '\033[0m')
    reset = '\033[0m'

    print(f'  Predicted Condition : {condition}')
    print(f'  Severity Level      : {color}{severity}{reset}')
    print(f'  Confidence Score    : {confidence*100:.0f}%')
    print(f'  Recommendation      : {rec}')
    print(f'  Report Status       : {status}')

except Exception as e:
    print('Could not parse response:', e)
    print('Raw response:', raw[:500])
" 2>/dev/null

echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

# ─── Step 4: Fetch report history ─────────────────────────────────────────────
echo ""
echo -e "${BLUE}[Step 4]${NC} Fetching your symptom report history..."

HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/symptoms/my-reports" \
  -H "Authorization: Bearer $TOKEN")

echo $HISTORY_RESPONSE | python3 -c "
import sys, json
try:
    data = json.loads(sys.stdin.read())
    reports = data.get('data', [])
    print(f'  Total reports saved: {len(reports)}')
    for i, r in enumerate(reports, 1):
        print(f'  [{i}] {r.get(\"predictedCondition\",\"N/A\")} — {r.get(\"severityLevel\",\"N/A\")} — {r.get(\"createdAt\",\"N/A\")}')
except Exception as e:
    print('Could not parse history:', e)
" 2>/dev/null

echo ""
echo -e "${GREEN}[✓] Test complete.${NC}"
echo ""
echo -e "  Open Swagger UI to test manually: ${CYAN}http://localhost:8080/swagger-ui.html${NC}"
echo -e "  Open the frontend:               ${CYAN}http://localhost:5173${NC}"
echo ""
