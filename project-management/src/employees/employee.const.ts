export const EMPLOYEE_QUERY = {
    SORT_BY: {
        name: 'sortBy',
        required: false,
        description: 'Sort by',
        enum: ['name', 'dob', 'experience'],
    },
};

export const EMPLOYEE_PROPERTIES = ['name', 'experience', 'dob'];