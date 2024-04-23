FROM node:18

ADD api .

ADD client .

RUN <<EOF
cd api 
npm install
npm start
EOF

RUN <<EOF
cd client 
npm install
npm start
EOF

#WIP