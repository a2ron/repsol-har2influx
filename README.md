# repsol-har2influx

To import repsol `./har/*.har` to `influxdb` (database: `repsol`).
```bash 
./repsol-har2influx.sh
```

To visualize the data in `grafana`.
```bash 
./grafana.sh
```
- Go to [http://localhost:3000/ Grafana](http://localhost:3000/)
- Create the influx datasource 
- Create the [dashboard grafana.dashboard.json](grafana.dashboard.json)