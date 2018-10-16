import {SubmissionError} from 'redux-form';
import React from 'react';
import {API_BASE_URL} from '../config';
import {withRouter} from 'react-router-dom';
import {normalizeResponseErrors} from './utils';
import axios from 'axios';
import {get} from 'axios';

export const doTitleSearch = values => dispatch => {
    let data = (values.title_query);
    console.log('doTitleSearch ran');
    return get(`${API_BASE_URL}/titles/${data}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
            body: JSON.stringify({titleName: data})
        })
        .then(console.log('request sent'))
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .catch(err => {
            const {reason, message, location} = err;
            if (reason === 'ValidationError') {
                // Convert ValidationErrors into SubmissionErrors for Redux Form
                return Promise.reject(new SubmissionError({[location]: message}));
            }

        })
}