import React from 'react';
import Screen from "../../common/screen";

import classNames from 'classnames';
import Backend from '../../Backend';
import Utils from '../../Utils';
import Notification from '../../common/notification';

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

    while (true) {
      try {

        let { result } = await Backend.request(
          `/movies/getByImdbId/${imdbId}`
        );
        if (result == "noMatch") {
          Notification.showWithFirstShared("IMdb record not found.");

          this.setState({
            fetchingMovieByImdbId: false
          });
          return;
        }

      } catch (e) {
        //  Wait a little before trying again
        await Utils.sleep(2500);
      }
    }

    setTimeout(() => {
      this.setState({
        fetchingMovieByImdbId: false
      })
    }, 2500);
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

    let data = new FormData(document.getElementById("add-movie-form"));

    let result = await Backend.request(
      "/movies/add",
      data
    );
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
                <input id="add-movie-imdb-id" type="text" disabled={!inputEnabled} />
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
              <input id="add-movie-age-rating" type="text" name="age-rating" disabled={!inputEnabled}
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
              <label for="add-movie-year">Plot</label>
              <textarea id="add-movie-year" disabled={!inputEnabled}
                name="plot"></textarea>
            </div>
            <div className="field">
              <label for="add-movie-year">Year</label>
              <input id="add-movie-year" type="text" name="year" disabled={!inputEnabled}
                style={{ width: 56 }} />
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