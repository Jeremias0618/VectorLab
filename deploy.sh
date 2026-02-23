#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy'

# deploy to GitHub Pages
git push -f git@github.com:Jeremias0618/VectorLab.git main:gh-pages

cd -