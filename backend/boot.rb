# frozen_string_literal: true

require 'bundler/setup'

require 'dotenv'
require 'zeitwerk'
require 'airctiverecord'
require 'grape'

Dotenv.load

Norairrecord.api_key = ENV['AIRTABLE_API_KEY']

loader = Zeitwerk::Loader.new
loader.push_dir("#{__dir__}/models")
loader.push_dir("#{__dir__}/api")
loader.enable_reloading
loader.setup
loader.eager_load

def reload!
  loader.reload
end

LOADER = loader
