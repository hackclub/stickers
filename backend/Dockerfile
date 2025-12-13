FROM ruby:3.3-alpine
RUN apk add --no-cache build-base tzdata
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install --deployment --without development test
COPY . .
EXPOSE 9292
CMD ["bundle", "exec", "puma", "-p", "9292", "-e", "production"]
