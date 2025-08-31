#!/bin/sh

export TZ="Asia/Bishkek"

DATE=$(date +"%d.%m.%Y %H:%M:%S")
MESSAGE_TEXT=$1
COMMIT_NAME=$(echo "$CI_COMMIT_MESSAGE" | head -n 1)
MESSAGE="${MESSAGE_TEXT} ${DATE}\nPipeline URL: ${CI_PIPELINE_URL}\nCommit name: ${COMMIT_NAME}\nBranch: ${CI_COMMIT_BRANCH}"

for CHAT_ID in $TELEGRAM_CHAT_IDS; do
  response=$(curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{
          \"chat_id\": \"${CHAT_ID}\",
          \"text\": \"${MESSAGE}\"
        }" \
    --write-out "%{http_code}" -o /dev/null)
    
  if [ "$response" -ne 200 ]; then
    echo "Failed to send message to ${CHAT_ID}. Response code: $response"
  else
    echo "Message sent to ${CHAT_ID} successfully."
  fi
done
