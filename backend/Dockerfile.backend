FROM ruby:3.3-alpine
RUN apk add --no-cache build-base
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local path 'vendor/bundle'
RUN bundle config set --local without 'development test'
RUN bundle install
COPY . .
EXPOSE 9292
CMD ["bundle", "exec", "puma", "-p", "9292", "-e", "production"]
