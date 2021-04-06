interface RefreshInterval {
    pause: boolean;
    value: bigint;
}

interface Period {
    from: string;
    to: string;
    mode: string;
}

interface Filter {

}

interface Query {
    language: string;
    query: string;
}

interface Sort {
    field: string;
    direction: string;
}

interface DiscoverUrlBuildParameters {
    host: string;
    refreshInterval?: RefreshInterval;
    period?: Period;
    columns: string[];
    filters: Filter[];
    index?: string;
    interval?: string;
    query?: Query;
    sort?: Sort;
}

export function buildDiscoverUrl({host, refreshInterval, period, columns, filters, index, interval, query, sort}: DiscoverUrlBuildParameters): string {
    const _g: string[] = []

    if (refreshInterval) {
        _g.push(`refreshInterval:(pause:${refreshInterval.pause ? refreshInterval.pause : '!f'},value:${refreshInterval.value})`)
    }

    if (!period) {
        const period: Period = {
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

    if (interval) {
        _a.push(`interval:${interval}`)
    }

    if (!query) {
        const query: Query = {
            language: 'lucene',
            query: ''
        }
    }

    _a.push(`query:(language:${query.language},query:'${query.query.replace('\'', '\\\'')}')`)

    if (!sort) {
        const sort: Sort = {
            field: '@timestamp',
            direction: 'desc'
        }
    }

    _a.push(`sort:!('${sort.field}',${sort.direction})`)

    return `${host}/app/kibana#/discover?_g=(${_g.join(',')})&_a=(${_a.join(',')})`
}
