set -e

docker-compose down

docker build -t tde_backend ./api/
docker build -t tde_predictor ./predictor/
docker build -t tde_frontend ./cliente/

docker-compose up -d
