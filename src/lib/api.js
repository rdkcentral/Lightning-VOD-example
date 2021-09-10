const _baseUrl = 'https://api.themoviedb.org/3/';
const _headers = {
    'Content-Type': 'application/json;charset=utf-8'
};
const _params = {
    'api_key': '66683917a94e703e14ca150023f4ea7c'
};

const _executeRequest = (config, retryCounter = 0) => {
    const {url, target, body, headers = {}, exceptions = {}, method, timeout} = config;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.timeout = timeout || 10000;

        for(let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        xhr.onload = () => {
            if(xhr.status !== 200 && exceptions[xhr.status]) {
                resolve(xhr);
            }
            else if(xhr.status !== 200) {
                reject(target);
            }
            else {
                resolve(JSON.parse(xhr.response));
            }
        }

        xhr.onerror = () => {
            if(xhr.status !== 200 && exceptions[xhr.status]) {
                resolve(xhr);
            }
            else {
                reject(target);
            }
        }

        xhr.ontimeout = () => {
            if(retryCounter === 3) {
                reject(target);
            }
            else {
                retryCounter++;
                resolve(_executeRequest(config, retryCounter))
            }
        }
        xhr.send(body);
    })
}

const _request = ({url, target, params = {}, headers = {}, exceptions = {}, method, timeout}) => {
    headers = {..._headers, ...headers};
    params = {..._params, ...params};
    url = url || _baseUrl + target;
    let body = null;
    if(method !== 'GET') {
        body = JSON.stringify(params);
    }
    if(method === 'GET' && params) {
        url += `?${qsify(params)}`;
    }
    return _executeRequest({url, target, body, headers, exceptions, method, timeout})
}

const qsify = obj => {
    const ec = v=>encodeURIComponent(v);
    return Object.keys(obj).map((key) => {
        return `${ec(key)}=${ec(obj[key])}`;
    }).join("&");
};

//public functions
export const getRequest = (obj) => {
    return _request({...obj, method: 'GET'});
};

export const generateRequestIterable = (obj, amount) => {
    return new Array(amount).fill("").map(() => _request({...obj, method: 'GET'}));
}

export const postRequest = (obj) => {
    return _request({...obj, method: 'POST'});
};

const _fetchPageData = (lists) => {
    const calls = lists.map(({path, params}) => {
        return getRequest({target: path, params})
    });
    return Promise.all(calls)
        .then((response) => {
            return response.map((list, index) => {
                return {title: lists[index].title, items: list.results}
            });
        });
}

export const getHomePage = () => {
    return _fetchPageData([
        {path: 'trending/all/day', title: 'Trending Today'},
        {path: 'trending/all/week', title: 'Trending this Week'},
    ]);
}