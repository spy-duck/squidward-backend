panel_dir=/opt/squidward


rm -rf $panel_dir

mkdir $panel_dir && cd $panel_dir || exit

echo "# Get docker-compose.yml"
wget --inet4-only -N -O $panel_dir/docker-compose.yml https://raw.githubusercontent.com/spy-duck/squidward-backend/refs/heads/main/docker-compose.yml

echo "# Get .env"
wget --inet4-only -N -O $panel_dir/.env https://raw.githubusercontent.com/spy-duck/squidward-backend/refs/heads/main/.env.sample

echo "# Get squidward.sh"
wget --inet4-only -N -O $panel_dir/squidward.sh https://raw.githubusercontent.com/spy-duck/squidward-backend/refs/heads/main/squidward.sh
chmod +x $panel_dir/squidward.sh

read -r -p "Enter frontend domain (ex. panel.squidward.tech): " front_end_domain
read -r -p "Enter Admin JWT token lifetime in hours (ex. 1): " jwt_lifetime

while true; do
    read -r -p "Do you want to enable docs Swagger and Scalar)?: [Y/n] " yn
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
sed -i "s/^JWT_AUTH_LIFETIME=.*/JWT_AUTH_LIFETIME=$jwt_lifetime/" .env
sed -i "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$postgres_password/" .env
sed -i "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$redis_password/" .env
sed -i "s/^IS_DOCS_ENABLED=.*/IS_DOCS_ENABLED=$docks_enabled/" .env

while true; do
    read -r -p "Start squidward panel?: [Y/n] " yn
    case $yn in
        [Yy]* )
          docker compose up -d && docker compose logs -f
          break;;
        [Nn]* )
          exit;;
        * ) echo "Please enter Yy|Nn";;
    esac
done