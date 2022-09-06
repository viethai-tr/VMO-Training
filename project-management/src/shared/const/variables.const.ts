export const API_QUERY = {
    SORT: {
        name: 'sort',
        required: false,
        description: 'Type of sort',
        enum: ['asc', 'desc'],
    },

    SEARCH: {
        name: 'search',
        required: false,
        description: 'Search',
        type: 'string',
    },

    LIMIT: {
        name: 'limit',
        required: false,
        description: 'Number of records per page',
        type: 'integer',
    },

    PAGE: {
        name: 'page',
        required: false,
        description: 'Current page',
        type: 'integer',
    },
};