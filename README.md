# Kibana URL builder

This library allows building Kibana URLs, for instance when sending notifications.

:warning:   Generated Kibana URLs have currently been tested on Kibana 6.x only.

## Usage

```shell
# Using npm
npm install @clickandmortar/kibana-url-builder

# Using Yarn
yarn add @clickandmortar/kibana-url-builder
```

```javascript
const kub = require('@clickandmortar/kibana-url-builder')

const url = kub.buildDiscoverUrl({
    host: 'http://kibana:5601',
    columns: ['_source'],
    filters: [],
    query: 'my query'
})

// url = http://kibana:5601/app/kibana#/discover?_g=(time:(from:now-15m,mode:quick,to:now))&_a=(columns:!(_source),filters:!(),interval:auto,query:(language:lucene,query:'my query'),sort:!('@timestamp',desc))
```

### Methods

**`buildDiscoverUrl ({ host, refreshInterval, period, columns, filters, index, interval, query, sort }: KibanaDiscoverUrlBuildParameters): string`**

This method returns a stateless Kibana "Discover" URL, which can be shared and used by anyone having access to the Kibana instance.

Currently supported filter types:

* Exists / Not exists
* Is / Is not
* One of / Not one of
* Between / Not between

| Parameter | Type | Default | Required | Example |
|---|---|---|---|---|
| `host` | `string` | | ✅ | `http://kibana:5601` |
| `columns` | `string[]` | `['_source']` | | `['_source', 'log']` |
| `filters` | `KibanaQueryFilter[]` | `[]` | | See below |
| `query` | `string` | | | `foo AND bar` (Lucene syntax) |
| `period` | `KibanaQueryPeriod` | `{ "from": "now-15m", "mode": "quick", "to": "now" }` | | See below |
| `index` | `string` | | When using filters | `my-index-pattern` |
| `interval` | `string` | `auto` | | `15m` |
| `refreshInterval` | `KibanaQueryRefreshInterval` | `{ "pause": true, "value": 300000 }` | | |
| `sort` | `KibanaQuerySort` | `{ "field": "@timestamp", "direction": "desc" }` | | |

#### Filters

TODO

#### Period

TODO

## Testing

```shell
npm run test
```

## Enhancements

* [x] Add support for filters
* [ ] Add tests: WIP
* [x] Add missing filters: is one of, is between
* [ ] Add documentation for filters
* [ ] Add documentation for advanced period
* [ ] Add support for Visualize query
