#!/bin/bash
git add .
git commit -m "Update frontend"
git push origin main

sshpass -p '9a91956d48' ssh -o StrictHostKeyChecking=no uid167681@shell.r5.websupport.sk -p29607 << 'REMOTE'
cd cstudios.ninja/sub/cleaningdemo
git pull origin main
cd frontend
npm install --legacy-peer-deps
npm run build
cp -r dist/* ..
REMOTE
