
FROM ruby:3.3-alpine AS backend
RUN apk add --no-cache build-base tzdata
WORKDIR /app
COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle config set --local path 'vendor/bundle'
RUN bundle config set --local without 'development test'
RUN bundle install
COPY backend/ .
EXPOSE 9292
CMD ["bundle", "exec", "puma", "-p", "9292", "-e", "production"]

# frontend

FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev
EXPOSE 3000
CMD ["node", "build"]
