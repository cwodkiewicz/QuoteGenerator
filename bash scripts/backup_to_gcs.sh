#!/bin/bash

echo "Script started at $(date)" >> /var/log/quote_generator/debug.log

# Path to your service account key JSON file
export GOOGLE_APPLICATION_CREDENTIALS="/var/keys/"

# GCS bucket name
BUCKET_NAME="quote_generator_bucket"

# Backup function to GCS bucket
backup_to_gcs() {
  TIMESTAMP=$(date +"%Y%m%d%H%M%S")
  BACKUP_FILENAME="backup_${TIMESTAMP}.tar.gz"

  echo "Creating backup of web files to GCS bucket..."
  tar -czvf "/var/www/html/${BACKUP_FILENAME}" -C /var/www/html quote_generator

  gsutil cp "/var/www/html/${BACKUP_FILENAME}" "gs://${BUCKET_NAME}/${BACKUP_FILENAME}"

  echo "Backup created and uploaded to GCS bucket: gs://${BUCKET_NAME}/${BACKUP_FILENAME}"
  rm "/var/www/html/${BACKUP_FILENAME}"  # remove local backup after upload
}

backup_to_gcs
