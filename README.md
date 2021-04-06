# Kibana URL builder

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
    query: {query: 'my query', language: 'lucene'}
})

// url = http://kibana:5601/app/kibana#/discover?_g=(time:(from:now-15m,mode:quick,to:now))&_a=(columns:!(_source),interval:auto,query:(language:lucene,query:'my query'),sort:!('@timestamp',desc))"
```
