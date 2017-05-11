# cmon-client
CMON client module

[![Build Status](https://travis-ci.org/geek/cmon-client.svg?branch=master)](https://travis-ci.org/geek/cmon-client)

## Usage

```javascript
const CMonClient = require('cmon-client');

const cmonClient = new CMonClient({
  key: '' // string or buffer version of tls key
  cert: '' // string or buffer version of tls cert
  datacenter 'cmon.us-sw-1.zone:9163' // datacenter to use for client instance
});

cmonClient.discover((err, containers) => {
  // handler error

  containers.forEach((container) => {
    cmonClient.metrics(container.vm_uuid, (err, metrics) => {
      // handle error

      console.log(metrics); // metrics are in the text exposition format that prometheus uses https://prometheus.io/docs/instrumenting/exposition_formats/
    });
  });
});
```


## API

### new CMonClient(options)

Create a new instance of a CMON client with the provided options.

- `key` - string or buffer used to construct an HTTPS Node.js Agent
- `cert` - string or buffer used to construct an HTTPS Node.js Agent
- `datacenter` - string in the format of hostname:port. Default is 'cmon.us-sw-1.zone:9163'. See `triton datacenters` for the available datacenters to use.

### discover(cb)

Retrieve all available containers running on the configured datacenter. `cb` has the signature `(err, containers)` where each `container` is in the following format:

```json
{
  "server_uuid": "91b757b5-bd29-2126-5ff9-ae9235011ff5",
  "source": "Changefeed",
  "vm_alias": "docker_container_name",
  "vm_image_uuid": "91b757b5-bd29-2126-5ff9-ae9235011ff5",
  "vm_owner_uuid": "91b757b5-bd29-2126-5ff9-ae9235011ff5",
  "vm_uuid": "81205d4a-92f4-c4d9-da8a-aafd689eeabb",
  "cached_date": 1494359171671
}
```

### metrics(vm_uuid, cb)

Retrieve the current available metrics for a running container specified by `vm_uuid`. `cb` has the signature `(err, metrics)` where metrics is an object representation of [exposition text-formatted](https://prometheus.io/docs/instrumenting/exposition_formats/#text-format-details) prometheus metrics using the [exposition module](https://www.npmjs.com/package/exposition).
