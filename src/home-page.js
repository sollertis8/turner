import React from 'react';
import {Field, reduxForm, focus} from 'redux-form';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {required, nonEmpty, length, isTrimmed} from './validators';
import Input from './input';
import {Button} from 'react-materialize';
import {connect} from 'react-redux';
import {API_BASE_URL} from './config';
import {normalizeResponseErrors} from './actions/utils';
import {SubmissionError} from 'redux-form';
import axios from 'axios';
import {get} from 'axios';
import './home-page.css';
import Header from './header';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            omdb: [],
            posters: [],
            titleNames: [],
            no_results: "",
            dbase_id: ""
        };
    }

    // query action to turner titles database
    onSubmit(values) {
        this.setState({posters: []})
        let title_query = values;
        let data = (values.title_query);
        return get(`${API_BASE_URL}/titles/${data}`).then(response => {
            this.setState({
                results: (response.data)

            })
            this.getOmdbData();
        }).catch(err => {
            const {reason, message, location} = err;
            if (reason === 'ValidationError') {
                // Convert ValidationErrors into SubmissionErrors for Redux Form
                return Promise.reject(new SubmissionError({[location]: message}));
            }

        })

    }

    // get posters for movie titles
    getOmdbData = () => {
        let titles = this.state.results;

        if (titles === undefined || titles.length === 0) {
            this.setState({no_results: "No titles found, please search again"})
        } else {

            for (let i = 0; i < titles.length; i++) {
                const title = titles[i].TitleName;

                // format retrieved titles for url query
                const formatted_query = title
                    .split(" ")
                    .join("+");

                const omdb_url = `http://www.omdbapi.com/?apikey=fae78175&t=${formatted_query}`
                get(`${omdb_url}`).then(response => {
                    let poster_found = response.data.Response === "False";
                    let omdb_title = response.data.Title;
                    let not_found = "./images/title-not-found.png";
                    const posters_joined = this
                        .state
                        .posters
                        .concat(poster_found
                            ? not_found
                            : response.data.Poster);
                    this.setState({posters: posters_joined})
                    const title_names_joined = this
                        .state
                        .title_names
                        .push
                        .apply(this.state.title_names, omdb_title);
                    this.setState({titleNames: title_names_joined});

                }).catch(err => {
                    const {reason, message, location} = err;
                    if (reason === 'ValidationError') {
                        // Convert ValidationErrors into SubmissionErrors for Redux Form
                        return Promise.reject(new SubmissionError({[location]: message}));
                    }

                })
            }
        }
    }

    handleClick(id) {
        this.getDetails(id);
    }

    render() {
        const omdb = this.state.omdb;
        const results = this.state.results;
        const posters = this.state.posters;

        let movie_name;
        let movie_id;

        let getTitleName = (index) => {
            return movie_name = results[index].TitleName;
        }

        let getTitleId = (index) => {
            return movie_id = results[index]._id;
        }
        // map each title to markup
        const titles = posters.map((title, index) => {
            return <div className="titles">
                <a href=""><img
                    className="title-poster"
                    src={title}
                    key={index}
                    titlename={getTitleName(index)}
                    alt="movie poster"/>
                    <div className="movie-link" width="10%" height="10%">{getTitleName(index)}</div>
                </a>
            </div>
        })
        const no_results = this.state.no_results;
        const header = <Header/>
        return (
            <main role="main">
                {header}
                <div className="main-content">
                    <h1>Find your Favorite Movie</h1>
                    <form
                        className="title-search-form"
                        onSubmit={this
                        .props
                        .handleSubmit(values => this.onSubmit(values))}>

                        <Field
                            component={Input}
                            type="text"
                            name="title_query"
                            placeholder="Search For A Movie Title"
                            id="title_query"
                            Validate={[required, nonEmpty, isTrimmed]}/>
                        <Button
                            className="submit-info-button"
                            waves="light"
                            type="submit"
                            disabled={this.props.pristine || this.props.submitting}>
                            Search
                        </Button>
                    </form>
                    <div className="results">{titles}</div>
                    <div className="no-results">{no_results}</div>
                </div>
            </main>

        )
    }
}

export default reduxForm({form: 'title-search-form'})(Home);
