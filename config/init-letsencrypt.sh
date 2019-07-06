#!/bin/bash

# Use this script when setting up a new server: it solves the chicken-egg problem of validating a certificate
# Read more at: https://github.com/wmnnd/nginx-certbot

domains=(api.perasconmanzanas.com server.perasconmanzanas.com metabase.perasconmanzanas.com)
rsa_key_size=4096
data_path="./deploy/data/certbot"
email="" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits
docker_file=docker-compose.pro.yml
docker_service_certbot=certbot
docker_service_nginx=nginx

if [ -d "$data_path" ]; then
  read -p "Existing data found for ${domains[*]}. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi


if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

for domain in "${domains[@]}"; do
  echo "### Creating dummy certificate for $domain ..."
  path="/etc/letsencrypt/live/$domain"
  mkdir -p "$data_path/conf/live/$domain"
  docker-compose -f $docker_file run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:1024 -days 1\
      -keyout '$path/privkey.pem' \
      -out '$path/fullchain.pem' \
      -subj '/CN=localhost'" $docker_service_certbot
  echo
done


echo "### Starting nginx ..."
docker-compose -f $docker_file up --force-recreate -d $docker_service_nginx
echo

for domain in "${domains[@]}"; do
  echo "### Deleting dummy certificate for $domain ..."
  docker-compose -f $docker_file run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain && \
    rm -Rf /etc/letsencrypt/archive/$domain && \
    rm -Rf /etc/letsencrypt/renewal/$domain.conf" $docker_service_certbot
  echo
done


for domain in "${domains[@]}"; do
  echo "### Requesting Let's Encrypt certificate for $domain ..."

  #Join $domains to -d args
  domain_args="-d $domain"

  # Select appropriate email arg
  case "$email" in
    "") email_arg="--register-unsafely-without-email" ;;
    *) email_arg="--email $email" ;;
  esac

  # Enable staging mode if needed
  if [ $staging != "0" ]; then staging_arg="--staging"; fi

  docker-compose -f $docker_file run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      $staging_arg \
      $email_arg \
      $domain_args \
      --rsa-key-size $rsa_key_size \
      --agree-tos \
      --force-renewal" $docker_service_certbot
  echo
done

echo "### Reloading nginx ..."
docker-compose -f $docker_file exec $docker_service_nginx nginx -s reload
