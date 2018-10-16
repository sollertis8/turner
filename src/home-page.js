import React from 'react';
import {Field, reduxForm, focus} from 'redux-form';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {required, nonEmpty, length, isTrimmed} from './validators';
import Input from './input';
import {Button, Icon} from 'react-materialize';
import {connect} from 'react-redux';
import {API_BASE_URL} from './config';
import {normalizeResponseErrors} from './actions/utils';
import {SubmissionError} from 'redux-form';
import axios from 'axios';
import {get} from 'axios';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            omdb: [],
            posters: []
        };
    }

    // query action to turner titles database
    onSubmit(values) {
        let title_query = values;
        let data = (values.title_query);
        return get(`${API_BASE_URL}/titles/${data}`)
            .then(console.log('request sent'))
            .then(response => {
                this.setState({
                    results: (response.data)
                })
                console.log(response.data)
            })
            .catch(err => {
                const {reason, message, location} = err;
                if (reason === 'ValidationError') {
                    // Convert ValidationErrors into SubmissionErrors for Redux Form
                    return Promise.reject(new SubmissionError({[location]: message}));
                }

            })

    }

    getOmdbData = () => {
        let titles = this.state.results;
        for (let i = 0; i < titles.length; i++) {
            const title = titles[i].TitleName;

            const formatted_query = title
                .split(" ")
                .join("+");

            console.log(formatted_query);
            const omdb_url = `http://www.omdbapi.com/?apikey=fae78175&t=${formatted_query}`
            get(`${omdb_url}`).then(response => {
                const joined = this
                    .state
                    .posters
                    .concat(response.data.Poster);
                this.setState({posters: joined})
            }).catch(err => {
                const {reason, message, location} = err;
                if (reason === 'ValidationError') {
                    // Convert ValidationErrors into SubmissionErrors for Redux Form
                    return Promise.reject(new SubmissionError({[location]: message}));
                }

            })
        }

    }

    componentWillReceiveProps(prevProps, prevState) {

        if (prevState.results !== this.state.results) {
            this.getOmdbData();
        }
    }

    render() {
        const omdb = this.state.omdb;
        const results = this.state.results;
        const posters = this.state.posters;

        const titles = posters.map((title, index) => {
            return <img src={title} key={index} alt="movie poster" width="10%" height="10%"/>
        })
        return (
            <main>
                <form
                    className="title-search-form"
                    onSubmit={this
                    .props
                    .handleSubmit(values => this.onSubmit(values))}>
                    <label htmlFor="title_query">Title Search</label>
                    <Field
                        component={Input}
                        placeholder="Search For A Movie Title"
                        type="text"
                        name="title_query"
                        id="title_query"
                        Validate={[required, nonEmpty, isTrimmed]}/>

                    <Button
                        className="submit-info-button"
                        waves="light"
                        type="submit"
                        disabled={this.props.pristine || this.props.submitting}>
                        Next
                    </Button>
                </form>
                <div className="results">{titles}</div>
            </main>
        )
    }
}

export default reduxForm({form: 'title-search-form'})(Home);
