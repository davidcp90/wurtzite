#!/bin/bash
set -e
npm install
npm install -g sonarqube-scanner
npm test
sonar-scanner -D sonar.projectKey=hawkeye -D sonar.projectName=Hawkeye
