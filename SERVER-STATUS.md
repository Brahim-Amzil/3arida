# Server Status

✅ **Server is running on port 3001**

## Access URLs

- **Main App**: http://localhost:3001
- **PDF Preview**: http://localhost:3001/pdf/petition/[PETITION_ID]
- **PDF API**: POST http://localhost:3001/api/petitions/[PETITION_CODE]/report

## Changes Made

1. Killed all running servers on port 3000
2. Fixed route conflict (renamed [id] to [code] to match existing pattern)
3. Started server on port 3001

## API Endpoint

The PDF generation endpoint is now:
```
POST /api/petitions/[code]/report
```

Note: Uses `code` parameter (not `id`) to match your existing API structure.

## Test Commands

```bash
# View HTML version
open http://localhost:3001/pdf/petition/YOUR_PETITION_CODE

# Generate PDF
curl -X POST http://localhost:3001/api/petitions/YOUR_PETITION_CODE/report --output test.pdf
```

## Server Process

Process ID: 5
Status: Running
Port: 3001
