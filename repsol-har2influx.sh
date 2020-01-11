#!/bin/bash
docker rm -f repsol-har2influx
node repsol.js > ./tmp/repsol.influx
docker run -d --name repsol-har2influx -p 8083:8083 -p 8086:8086 -v $PWD/tmp/repsol.influx:/data/repsol.influx influxdb 
sleep 3
docker exec -it repsol-har2influx influx -import -path=/data/repsol.influx -precision=ns