# Quote Generator

The Quote Generator is a web-based platform designed to provide users with daily inspiration through a selection of quotes. The project blends hardware and cloud technologies to create an interactive and visually appealing experience.

## Overview

The Quote Generator project incorporates various technologies, including HTML, JavaScript, CSS, Flask, Google Cloud Platform (GCP), Raspberry Pi, and more. It offers multiple generators, such as Random Quote, Random Author Quote, Random Category Quote, and an interactive display on a Raspberry Pi's LED matrix.

## Features

- **Dynamic Web Platform**: Built with HTML, JavaScript, and CSS, the Quote Generator allows users to manually initiate quote generation through the "New Quote" button.

- **User-Defined Preferences**: Users can actively engage in the quote selection process by customizing preferences such as specific categories or authors.

- **Text-to-Speech API Integration**: The project integrates the Google Cloud Text-to-Speech API, providing users with the option to listen to quotes.

- **Automated Backups**: A Bash script automates the backup process to a GCP bucket, ensuring data integrity and availability. Scheduled execution is managed through a cron job.

- **Interactive LED Display**: Hardware integration involves a Raspberry Pi, Flask server, and a color-adapting LED matrix. Users can trigger an interactive display of quotes with the "Display on Raspberry Pi" button.

- **Cloud SQL Integration**: Efficiently manages a database storing quotes fetched from quotable.io. This minimizes reliance on external APIs, improves response times, and potentially saves costs.

## Project Setup

## 1. Local Development Environment

Ensure you have a local development environment with support for HTML, CSS, and JavaScript.

## 2. Google Cloud Platform (GCP) VM Setup

- Create a Linux virtual machine (VM) in Google Cloud Platform (GCP).
- Establish an SSH connection to access the terminal.

## 3. Nginx Installation and Configuration

Install and configure Nginx correctly on the VM.

## 4. Transfer Project Files to VM

- Transfer the local project files to the designated directory: `/var/www/html`.
- Organize the project within a specific folder for clarity.

## 5. Bash Script for Backup and Monitoring

- Use Bash script (`backup_to_gcs.sh`) for backups to gcp buckets and (`web_server_management.sh`) for backups in the VM and web traffic monitoring.
- Configure the script with precision for proper functionality and responsiveness to user-defined parameters.

## 6. Google Cloud Text-to-Speech API Integration

- Extend the project to include the Google Cloud Text-to-Speech API.
- Incorporate API calls within the JavaScript logic of the web platform using the GCP Speech-to-Text API key.
- Enable users to listen to spoken versions of quotes for an enhanced and dynamic user experience.

## 7. Automated Backup to Google Cloud Storage

- Back up project data to Google Cloud Storage buckets using the `backup_to_gcs.sh` Bash script.
- Schedule the script's execution through a cron job linked to a VM instance scheduler for regular and automated backups.

## 8. Raspberry Pi Integration

- Set up a Flask server on the Raspberry Pi.
- Implement 'Display on Raspberry Pi' buttons in the HTML with corresponding CSS styles.
- Use JavaScript to send quotes to the Pi through a Flask endpoint, requiring knowledge of the Pi's IP address and server port.

## 9. Cloud SQL Integration

- Create and run a Cloud SQL instance for data management.
- Establish a connection in Cloud Shell to create a database and table using SQL.
- Execute a Node.js script on Cloud Shell to fill the database with quotes.
- On the GCP VM, create another Node.js script with user configuration to fetch quotes from the Cloud SQL instance.
- Ensure the Cloud Proxy is running alongside the Node server, including a direct path to the service account key.
- Create a VPC network firewall rule in GCP, allowing connections to the chosen port.
- Update the tag in VM settings.
- Handle CORS prevention in the HTML meta tag and the Node server middleware on the VM.

This detailed setup facilitates the replication of the project, ensuring expected behavior and successful integration of both the Raspberry Pi and Cloud SQL.

## Usage

1. Clone the repository: `git clone https://github.com/your-username/quote-generator.git`
2. Follow the setup guide to configure the project environment.
3. Run the Flask server on the Raspberry Pi for LED matrix display and the Node.js server alomg with Cloud SQL proxy on the GCP VM for full functionality.
4. Access the web platform through your browser.
