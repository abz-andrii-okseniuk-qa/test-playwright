#postgresql
# dev ssh 10.225.1.3 5432
# stage ssh 10.225.0.3 5432
#target port 5532

#redis
# dev ssh  dev-redis-master 6379
# stage ssh 10.253.23.147 6379
#target port 5379

BY_SSH=0

PG_HOST=""
PG_CLICKSTREAM_HOST=""
PG_CLICKSTREAM_DURABLE_HOST=""
REDIS_HOST=""
MONGO_HOST=""

SRC_PORT=""
TARGET_PORT=""
TARGET_HOST=""

if [[ $1 == "" || $2 == "" ]]; then
    echo Error use command in format ./connect_to.sh {namespace} {connection}
    echo Example ./connect_to.sh dev postgres
    echo Namespaces dev, dev2, stage, prod
    echo Connections postgres redis mongodb clickstream clickstream_durable
    exit
fi

case $1 in
  "dev")
	  gcloud container clusters get-credentials dev-franceverif-gke --zone=europe-west3
    PG_HOST="10.225.1.3"
    REDIS_HOST="dev-redis-master-0"
    PG_CLICKSTREAM_HOST="10.225.1.3"
    MONGO_HOST="dev-mongo-7468dfcb54"
  ;;
  "dev2")
	  gcloud container clusters get-credentials dev-franceverif-gke --zone=europe-west3
    PG_HOST="10.225.1.6"
    REDIS_HOST="dev-redis-master-0"
    PG_CLICKSTREAM_HOST="10.225.1.6"
    MONGO_HOST="dev2-mongo-8549fd59d8-bbgt8"
  ;;
  "stage")
	  gcloud container clusters get-credentials dev-franceverif-gke --zone=europe-west3
    PG_HOST="10.225.0.3"
    REDIS_HOST="10.253.23.147"
    PG_CLICKSTREAM_HOST=""
    MONGO_HOST="stage-mongo-0"
  ;;
  "prod")
	  gcloud container clusters get-credentials prod-franceverif-gke --zone=europe-west3
    PG_HOST="10.220.0.5"
    PG_CLICKSTREAM_HOST="prod-postgres-clickstream-0"
    PG_CLICKSTREAM_DURABLE_HOST="prod-postgresql-clickstream-durable-data-0"
    REDIS_HOST="10.157.79.5"
    MONGO_HOST=""
  ;;
esac


case $2 in
  "postgres")
    SRC_PORT=5432
    TARGET_PORT=5532
    TARGET_HOST=$PG_HOST
    if [[ $1 == "dev" || $1 == "dev2" || $1 == "stage" || $1 == "prod" ]]; then
        BY_SSH=1
    fi
  ;;
  "redis")
    SRC_PORT=6379
    TARGET_PORT=5379
    TARGET_HOST=$REDIS_HOST
    if [[ $1 == "stage" || $1 == "prod" ]]; then
        BY_SSH=1
    fi
  ;;
  "mongodb")
    SRC_PORT=27417
    TARGET_PORT=27017
    TARGET_HOST=$MONGO_HOST
  ;;

  "clickstream")
    SRC_PORT=5432
    TARGET_PORT=5532
    TARGET_HOST=$PG_CLICKSTREAM_HOST
  ;;

  "clickstream_durable")
    SRC_PORT=5432
    TARGET_PORT=5532
    TARGET_HOST=$PG_CLICKSTREAM_DURABLE_HOST
  ;;
esac
echo ENVIRONMENTS INIT $BY_SSH

if [[ $BY_SSH == 1 ]]; then
  TEMP_POD_NAME="forward-ports-$(openssl rand -base64 12 | tr '[:upper:]' '[:lower:]' | sed "s/[^a-z0-9]*//g")"
  echo "\nStart session for pod\n$TEMP_POD_NAME"
  kubectl run --restart=Never --image=alpine/socat "$TEMP_POD_NAME" -- -d -d tcp-listen:$SRC_PORT,fork,reuseaddr tcp-connect:$TARGET_HOST:$SRC_PORT
  kubectl wait --for=condition=Ready pod/$TEMP_POD_NAME
  kubectl port-forward pod/$TEMP_POD_NAME $TARGET_PORT:$SRC_PORT
  echo "\nEnd session for pod\n$TEMP_POD_NAME"
  kubectl delete pod/$TEMP_POD_NAME --grace-period 1
  exit
fi

kubectl port-forward pods/"$TARGET_HOST" -n "$1" $TARGET_PORT:$SRC_PORT