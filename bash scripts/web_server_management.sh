#!/bin/bash

#gcp vm info
VM_INSTANCE_NAME=""
ZONE=""

#backup function
backup_web_files() {
  TIMESTAMP=$(date +"%Y%m%d%H%M%S")
  BACKUP_DIR="/var/backups"
  BACKUP_FILENAME="backup_${TIMESTAMP}.tar.gz"

  echo "Creating backup of web files..."
  tar -czvf "${BACKUP_DIR}/${BACKUP_FILENAME}" -C /var/www/html quote_generator


  echo "Backup created: ${BACKUP_DIR}/${BACKUP_FILENAME}"
}

#traffic monitoring function
monitor_web_traffic() {
  LOG_FILE="/var/log/nginx/access.log"

  echo "Monitoring web traffic..."
  tail -f "${LOG_FILE}"
}

#menu
while true; do
  echo "Web Server Management Script"
  echo "1. Create Backup"
  echo "2. Monitor Web Traffic"
  echo "3. Exit"

  read -p "Select an option (1/2/3): " choice

  case $choice in
    1)
      backup_web_files
      ;;
    2)
      monitor_web_traffic
      ;;
    3)
      echo "Exiting Web Server Management Script."
      exit 0
      ;;
    *)
      echo "Invalid option. Please select again."
      ;;
  esac
done

