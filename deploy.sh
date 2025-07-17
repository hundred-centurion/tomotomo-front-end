#!/bin/zsh

git pull origin develop
git submodule update --recursive

npm run build
cd dist
serve
