#!/bin/bash

# Get all variable names from production
VARS=($(vercel env ls production | grep "Encrypted" | awk '{print $1}'))

echo "Found ${#VARS[@]} variables to copy to Preview and Development"

for var in "${VARS[@]}"; do
    echo "Processing $var..."
    
    # Get the value from production
    value=$(vercel env pull --environment=production .env.temp && grep "^$var=" .env.temp | cut -d'=' -f2- | tr -d '"')
    
    if [ -n "$value" ]; then
        # Add to Preview (remove first if exists)
        vercel env rm "$var" preview --yes 2>/dev/null || true
        echo "$value" | vercel env add "$var" preview
        
        # Add to Development (remove first if exists)  
        vercel env rm "$var" development --yes 2>/dev/null || true
        echo "$value" | vercel env add "$var" development
        
        echo "✅ $var copied to Preview and Development"
    else
        echo "❌ Could not get value for $var"
    fi
done

# Clean up
rm -f .env.temp

echo "✅ All variables copied to Preview and Development!"