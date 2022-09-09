export const PROJECT_QUERY = {
    SORT_BY: {
        name: 'sortBy',
        required: false,
        description: 'Sort by',
        enum: ['name', 'starting_date'],
    },
};

export const PROJECT_COUNT = {
    STATUS: {
        name: 'status',
        required: false,
        description: 'Project status',
        type: 'string',
    },
    TYPE: {
        name: 'type',
        required: false,
        description: 'Project type',
        type: 'string',
    },
    CUSTOMER: {
        name: 'customer',
        required: false,
        description: 'Customer',
        type: 'string',
    },
    TECHNOLOGY: {
        name: 'technology',
        required: false,
        description: 'Technology',
        type: 'string',
    },
    STARTING_DATE: {
        name: 'startingDate',
        required: false,
        description: 'Starting date of project',
        type: 'string',
    },
};

export const PROJECT_PROPERTIES = ['name', 'starting_date'];
