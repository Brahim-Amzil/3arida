#!/bin/bash

echo "Checking SMTP environment variables on Vercel..."
echo ""

cd 3arida-app

# Check if variables exist
echo "Checking SMTP_HOST..."
vercel env ls | grep SMTP_HOST

echo ""
echo "Checking SMTP_PORT..."
vercel env ls | grep SMTP_PORT

echo ""
echo "Checking SMTP_USER..."
vercel env ls | grep SMTP_USER

echo ""
echo "Checking SMTP_PASSWORD..."
vercel env ls | grep SMTP_PASSWORD

echo ""
echo "If any variables are missing, add them with:"
echo "vercel env add SMTP_HOST"
echo "vercel env add SMTP_PORT"
echo "vercel env add SMTP_USER"
echo "vercel env add SMTP_PASSWORD"
