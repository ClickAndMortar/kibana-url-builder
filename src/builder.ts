interface KibanaQueryRefreshInterval {
    pause: boolean;
    value: bigint;
}

interface KibanaQueryPeriod {
    from: string;
    to: string;
    mode: string;
}

interface KibanaQueryFilter {

}

interface KibanaQueryQuery {
    language: string;
    query: string;
}

interface KibanaQuerySort {
    field: string;
    direction: string;
}

interface KibanaDiscoverUrlBuildParameters {
    host: string;
    refreshInterval?: KibanaQueryRefreshInterval;
    period?: KibanaQueryPeriod;
    columns: string[];
    filters: KibanaQueryFilter[];
    index?: string;
    interval?: string;
    query?: string;
    sort?: KibanaQuerySort;
}

export function buildDiscoverUrl({host, refreshInterval, period, columns, filters, index, interval, query, sort}: KibanaDiscoverUrlBuildParameters): string {
    const _g: string[] = []

    if (refreshInterval) {
        _g.push(`refreshInterval:(pause:${refreshInterval.pause ? refreshInterval.pause : '!f'},value:${refreshInterval.value})`)
    }

    if (!period) {
        period = {
            from: 'now-15m',
            to: 'now',
            mode: 'quick'
        }
    }

    _g.push(`time:(from:${period.from},mode:${period.mode},to:${period.to})`)

    const _a: string[] = []
    _a.push(`columns:!(${columns.join(',')})`)

    if (index) {
        _a.push(`index:'${index}'`)
    }

    if (!interval) {
        interval = 'auto'
    }

    _a.push(`interval:${interval}`)

    const kibanaQuery: KibanaQueryQuery = {
        language: 'lucene',
        query: query ? query : ''
    }

    _a.push(`query:(language:${kibanaQuery.language},query:'${kibanaQuery.query.replace('\'', '\\\'')}')`)

    if (!sort) {
        sort = {
            field: '@timestamp',
            direction: 'desc'
        }
    }

    _a.push(`sort:!('${sort.field}',${sort.direction})`)

    return `${host.replace(/\/$/, '')}/app/kibana#/discover?_g=(${_g.join(',')})&_a=(${_a.join(',')})`
}
