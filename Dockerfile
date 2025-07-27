FROM node:lts-alpine



# environments
ENV NODE_ENV=production
ENV DATABASE_URL=mysql://root:root@localhost:3307/ankiwebdb?connection_limit=10&pool_timeout=200
ENV BETTER_AUTH_SECRET=WhJspG29ZAwLmpBeD5WBmMjC5nVUuuPr
ENV BETTER_AUTH_URL=http://localhost:3000

# rest
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
RUN npm run build
CMD ["npm", "start"]
