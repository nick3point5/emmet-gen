#!/bin/sh

# Get the current version from package.json
VERSION=$(node -pe "require('./package.json').version")

echo hello
# Increment the version number using the npm version command
npm version patch
npm run lint:fix

# Add the updated package.json to the commit
git add package.json