panel_dir=/opt/squidward


rm -rf $panel_dir

mkdir $panel_dir && cd $panel_dir || exit

echo "# Get docker-compose.yml"
wget --inet4-only -N -O $panel_dir/docker-compose.yml https://raw.githubusercontent.com/spy-duck/squidward-backend/refs/heads/master/docker-compose.yml

echo "# Get .env"
wget --inet4-only -N -O $panel_dir/.env https://raw.githubusercontent.com/spy-duck/squidward-backend/refs/heads/master/.env.sample

read -p "Enter frontend domain (ex. panel.squidward.tech): " front_end_domain
while true; do
    read -p "Do you want to enable docs Swagger and Scalar)?: [Y/n] " yn
    case $yn in
        [Yy]* )
          docks_enabled=true
          break;;
        [Nn]* )
          docks_enabled=false
          break;;
        * ) echo "Please enter Yy|Nn";;
    esac
done

# Generate secure keys
jwt_auth_secret=$(openssl rand -hex 64)
postgres_password=$(openssl rand -hex 24)
redis_password=$(openssl rand -hex 24)

echo "# Update .env"
sed -i "s/^FRONT_END_DOMAIN=.*/FRONT_END_DOMAIN=$front_end_domain/" .env
sed -i "s/^JWT_AUTH_SECRET=.*/JWT_AUTH_SECRET=$jwt_auth_secret/" .env
sed -i "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$postgres_password/" .env
sed -i "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$redis_password/" .env
sed -i "s/^IS_DOCS_ENABLED=.*/IS_DOCS_ENABLED=$docks_enabled/" .env

while true; do
    read -p "Start squidward panel?: [Y/n] " yn
    case $yn in
        [Yy]* )
          docker compose up -d && docker compose logs -f
          break;;
        [Nn]* )
          exit;;
        * ) echo "Please enter Yy|Nn";;
    esac
done