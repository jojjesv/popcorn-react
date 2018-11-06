import React from 'react';
import Screen from "../../common/screen";

import classNames from 'classnames';
import Backend from '../../Backend';
import Utils from '../../Utils';
import Notification from '../../common/notification';
import service from './service';

/**
 * Screen for adding a movie.
 * @author Johan Svensson
 */
export default class AddMovieScreen extends Screen {
  state = {
    fetchingMovieByImdbId: false,
    submitting: false
  }

  /**
   * Fetches movie info and autofills the form.
   */
  async fetchMovieByImdbId(imdbId) {
    let { state } = this;

    if (state.fetchingMovieByImdbId || (imdbId || "").length < 1) {
      //  Busy
      return;
    }

    this.setState({
      fetchingMovieByImdbId: true
    });

    let result = await service.fetchMovieByImdbId(imdbId);
    if (result == "noMatch") {
      Notification.showWithFirstShared("IMdb record not found.");

      this.setState({
        fetchingMovieByImdbId: false
      });
      return;
    }

    this.setState({
      fetchingMovieByImdbId: false
    });

    this.populateFields(result);
  }

  /**
   * Populates the input fields with data.
   * @param {Movie} data 
   */
  populateFields(data) {
    //  Sets the value of a node
    const set = (id, val) => document.getElementById(id).value = val;

    set("add-movie-title", data.title);
    set("add-movie-plot", data.plot);
    set("add-movie-age-rating", data.ageRating);
    set("add-movie-categories", (data.categories || []).map(c => c.toLowerCase()).join(","));
    set("add-movie-score", data.score);
    set("add-movie-runtime", data.runtime);
    set("add-movie-year", data.year);
  }

  /**
   * Asynchronously submits the form.
   */
  async submit() {
    let { state } = this;
    if (state.submitting) {
      //  Busy
      return;
    }

    this.setState({
      submitting: true
    });

    let result = await service.submit(
      new FormData(document.getElementById("add-movie-form"))
    );

    this.setState({
      submitting: false
    });

    if (result.validationError) {
      return this.onValidationError(result.validationError)
    }
  }

  onValidationError(msg) {
    Notification.showWithFirstShared("Validation error: " + msg);
  }

  renderContent() {
    let { state } = this;

    let inputEnabled = !state.fetchingMovieByImdbId && !state.submitting;

    return (
      <section className="add-movie">
        <form id="add-movie-form">
          <div className="fieldset spanned">
            <div className="field">
              <div>
                <label for="add-movie-imdb-id">IMdb ID</label>
                <input id="add-movie-imdb-id" type="text" disabled={!inputEnabled}
                  maxLength="12" name="imdb_id" />
                <button className={classNames({
                  busy: state.fetchingMovieByImdbId
                })} onClick={e => {
                  e.preventDefault();
                  this.fetchMovieByImdbId(
                    document.getElementById('add-movie-imdb-id').value
                  );
                }}>Get movie</button>
              </div>
              <p className="note small">Enter the movie's IMdb ID to autofill the form.</p>
            </div>
          </div>

          <div className="fieldset">
            <div className="field">
              <label for="add-movie-title">Title</label>
              <input id="add-movie-title" type="text" name="title" disabled={!inputEnabled} />
            </div>
            <div className="field">
              <label for="add-movie-age-rating">Age rating</label>
              <input id="add-movie-age-rating" type="text" name="age_rating" disabled={!inputEnabled}
                style={{ width: 56 }} />
            </div>
            <div className="field">
              <label for="add-movie-categories">Categories</label>
              <input id="add-movie-categories" type="text" name="categories" disabled={!inputEnabled} />
              <p className="note small">Separate each category with a comma.</p>
            </div>
            <div className="field">
              <label for="add-movie-runtime">Runtime</label>
              <input id="add-movie-runtime" type="text" name="runtime" disabled={!inputEnabled}
                style={{ width: 56 }} />
              <p className="inline-label">minutes</p>
            </div>
            <div className="field">
              <label for="add-movie-plot">Plot</label>
              <textarea id="add-movie-plot" disabled={!inputEnabled}
                name="plot"></textarea>
            </div>
            <div className="field">
              <label for="add-movie-year">Year</label>
              <input id="add-movie-year" type="text" name="year"
                disabled={!inputEnabled} maxLength="4"
                style={{ width: 56 }} />
            </div>
            <div className="field">
              <label for="add-movie-score">Score</label>
              <input id="add-movie-score" type="text" name="score"
                disabled={!inputEnabled} maxLength="3"
                style={{ width: 56 }} />
              <p className="inline-label">/ 10</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className={classNames({
              busy: state.submitting
            })} onClick={e => {
              e.preventDefault();
              this.submit();
            }}>Add movie</button>
          </div>
        </form>
      </section>
    )
  }
}