# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_SecurTrust_session',
  :secret      => 'b4b0223dddccf2c50a342fb6cba6f4d058385743360a9a46f0fb95fe1e36e05cb2000b6e4123656ad0415bd6ef61fb69ed927c3c627aef15f3cf5a3a5fc889ec'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
