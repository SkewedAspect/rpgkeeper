#!/bin/sh
#-----------------------------------------------------------------------------------------------------------------------
# Docker Entrypoint Script
#-----------------------------------------------------------------------------------------------------------------------

# Load git info from build-time captured values
if [ -f /tmp/commit_sha ]; then
    export COMMIT_SHA=$(cat /tmp/commit_sha | tr -d '\n')
fi

if [ -f /tmp/commit_ref ]; then
    export COMMIT_REF=$(cat /tmp/commit_ref | tr -d '\n')
fi

if [ -f /tmp/build_date ]; then
    export BUILD_DATE=$(cat /tmp/build_date | tr -d '\n')
fi

# Execute the main command
exec "$@"

#-----------------------------------------------------------------------------------------------------------------------
