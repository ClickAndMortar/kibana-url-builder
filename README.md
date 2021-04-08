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

When using filters, you must provide the index pattern name using `index` property.

Supported filter types:

* Exists / Not exists (type = `exists`)
* Is / Is not (type = `query`)
* One of / Not one of (type = `phrases`)
* Between / Not between (type = `range`)

"Not" filters can be used setting the `negate` property of the filter to `true`.

All filters are of type `KibanaQueryFilter` and share the following properties:

| Property | Type | Default | Required | Description |
|---|---|---|---|---|
| `type` | `string` | - | ✅ | See below examples |
| `field` | `string` | - | ✅ | Name of the ES field |
| `value` | `string|boolean|number|string[]` | - | ✅ | See below examples |
| `negate` | `boolean` | `false` | - | Negate the filter |
| `alias` | `string` | _none_ | | Alias for the filter |
| `disabled` | `boolean` | `false` | Mark filter as disabled |

##### Exists / Not exists

```json5
{
  type: 'exists',
  field: 'statusCode'
}
```

##### Is / Is not

```json5
{
  type: 'query',
  field: 'namespace',
  value: 'kube-system'
}
```

##### One of / Not one of

```json5
{
  type: 'phrases',
  field: 'namespace',
  value: ['kube-system', 'default']
}
```

##### Between / Not between

```json5
{
  type: 'range',
  field: 'statusCode',
  value: [400, 499]
}
```

#### Period

Three period presets are available:

* `quick` and `relative`: dates using [Elasticsearch Date Math](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#date-math), ie. `now`, `now-7d`, etc.
* `absolute`: absolute dates

##### Quick & Relative periods

```json5
{
  from: 'now-7d',
  to: 'now',
  mode: 'quick'
}
```


##### Absolute periods

```json5
{
  from: '2021-03-31T22:00:00.000Z',
  to: '2021-04-02T21:59:59.999Z',
  mode: 'absolute'
}
```

## Testing

```shell
npm run test
```

## Enhancements

* [x] Add support for filters
* [ ] Add tests: ⚙️ WIP
* [x] Add missing filters: is one of, is between
* [x] Add documentation for filters
* [x] Add documentation for advanced period
* [ ] Add support for Visualize query
