#!/bin/sh

# Get the current version from package.json
VERSION=$(node -pe "require('./package.json').version")

# Increment the version number using the npm version command
npm version $VERSION --no-git-tag-version
npm lint:fix

# Add the updated package.json to the commit
git add package.json