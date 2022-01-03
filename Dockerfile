FROM node:16

WORKDIR /service/
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN chmod +x wait-for-it.sh

EXPOSE 3000

ENTRYPOINT [ "./wait-for-it.sh", "postgres:5432", "--"]