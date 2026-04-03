@echo off
cd frontend
set PUBLIC_PATH=/
call npm run build
cd dist
scp -o BatchMode=yes -r * root@110.165.17.170:/var/www/haema-archi/dist/
cd ..
set PUBLIC_PATH=/haema/
call npm run build
cd dist
scp -o BatchMode=yes -r * root@110.165.17.170:/root/homepage/public/haema/
ssh -o BatchMode=yes root@110.165.17.170 "chmod -R 755 /var/www/haema-archi/dist/ && chmod -R 755 /root/homepage/public/haema/ && cd /root/homepage && npm run build && pm2 restart ninetynine-hub && nginx -s reload"
