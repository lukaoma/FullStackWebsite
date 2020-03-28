echo "Waiting for Selenium Hub to be ready..."

SEL_STATUS_URL="http://${HUB_HOST}:${HUB_PORT}/wd/hub/status"

SUCCESS_CMD="jq .status | grep 0"

while ! curl -s "${SEL_STATUS_URL}" | sh -c "${SUCCESS_CMD}"; do
  echo -n '.'
  sleep 0.1
done
echo "Selenium hub up."
sleep 10 # wait for runner
sleep 30 # wait for development server
