import React from 'react';
import PropTypes from 'prop-types';
import Movie from '../../models/Movie';
import Screen from '../../common/screen';

import classNames from 'classnames';
import './styles.scss';
import Utils from '../../Utils';
import GridList from '../../common/grid_list';
import ActorPreview from '../../common/actor_preview';
import ActorInfoScreen from '../actor_info';
import ScreenStack from '../../common/screen/ScreenStack';
import Backend from '../../Backend';
import TaskIndicator from '../../common/task_indicator';
import service from './service';
import Modal from '../../common/modal';

/**
 * Screen which shows info about a specific movie.
 * Fetches actors and additional info.
 * @author Johan Svensson
 */
export default class MovieInfoScreen extends Screen {
  static propTypes = {
    movieId: PropTypes.any,
  }

  state = {
    /**
     * @type {Movie}
     */
    data: null,
    fetchBusy: false,
    actorInfoVisible: false,
    actorInfoData: null,
    editMode: false,
    saveBusy: false,
    deleteMovieModalVisible: false,
    deleteMovieBusy: false
  };

  /**
   * Modified data while in edit mode.
   * @type {Movie}
   */
  modifiedData;

  constructor(props) {
    super(props);
    this.renderField = this.renderField.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  /**
   * Fetches movie info.
   */
  async fetch() {
    let { state, props } = this;
    if (state.fetchBusy) {
      return;
    }

    this.setState({
      fetchingData: true
    });

    let data = await Backend.get(
      `/movie/${props.movieId}`
    );

    this.setState({
      data,
      fetchingData: false
    })
  }

  backNavigationDisabled = () => this.state.saveBusy

  /**
   * Submits the modified state to the backend.
   */
  async saveModified() {
    let { state, modifiedData } = this;
    if (state.saveBusy) {
      return;
    }

    if (Utils.isEmpty(modifiedData)) {
      this.setState({
        editMode: false
      });
      return;
    };

    this.setState({
      saveBusy: true
    });

    service.saveModification(state.data.id, modifiedData);

    //  Success!
    this.applyModifiedData();

    this.setState({
      saveBusy: false,
      editMode: false
    });
  }

  applyModifiedData() {
    let { modifiedData, state } = this;
    for (let key in modifiedData) {
      state.data[key] = modifiedData[key];
    }
  }

  getValueForField(field, data) {
    let { state } = this;
    let val = data[field];
    if (Array.isArray(val)) {
      val = val.join(", ");
    }
    if (!state.editMode) {
      switch (field) {
        case 'runtime':
          //  Convert to time str
          val = Utils.minutesToTimeString(val);
          break;

        case 'possessor':
          if (!val) {
            val = "In stock";
          }
          break;
      }
    }
    return val;
  }

  /**
   * Renders a field which is editable when in edit mode.
   * @param {Movie} data
   * @param {string} field field type, e.g. score, title
   * @param {any} icon Icon resource
   */
  renderField(field, data, icon) {
    let { state, modifiedData } = this;
    return (
      <div>
        <span><span className={`fas fa-${icon} icon`} role="img"></span></span>
        <input ref={e => e && (e.value = e.title = this.getValueForField(field, data))}
          type="text" className="editable" disabled={!state.editMode}
          onChange={e => {
            modifiedData[field] = e.currentTarget.value
          }} />
      </div>
    )
  }

  renderHeaderExtraContent() {
    let { state } = this;

    let { saveBusy } = state;

    return (
      <div style={{ display: 'inline-block' }}>
        {
          !state.editMode ? (
            <button className="extra-btn" disabled={saveBusy} onClick={() => this.enableEditMode()}>
              <span>Edit</span>
            </button>
          ) : (
              //  Currently in edit mode
              <div style={{ display: 'inline-block' }}>
                <button className="extra-btn" disabled={saveBusy} onClick={() => this.disableEditMode()}>
                  <span>Cancel</span>
                </button>
                <button
                  className={classNames({
                    "extra-btn": true,
                    "busy": saveBusy
                  })}
                  onClick={() => this.saveModified()}>
                  <span style={{ fontWeight: 'bold' }}>Save</span>
                </button>
              </div>
            )
        }
      </div>
    )
  }

  enableEditMode() {
    this.modifiedData = {};
    this.setState({
      editMode: true
    });
  }

  disableEditMode() {
    this.setState({
      editMode: false
    })
  }

  /**
   * Deletes the current movie.
   */
  async deleteMovie() {
    let { state } = this;
    let { data } = state;

    if (state.deleteMovieBusy) {
      //  Already busy
      return;
    }

    this.setState({
      deleteMovieBusy: true
    });

    let result = await Backend.delete(`/movie/${data.id}`);

    this.setState({
      deleteMovieBusy: false
    });
  }

  renderContent() {
    let { state, renderField } = this;
    let { data } = state;

    return (
      <div className="movie-info">
        {
          data ? (
            <div>
              <header className={classNames({
                "hero": true,
                "has-picture": !!data.pictureUri
              })}>
                <div className="gradient"></div>
                <div className="background-image blurred" style={{
                  backgroundImage: `url(${data.pictureUri})`
                }}>
                </div>
                <div className="background-image contain" style={{
                  backgroundImage: `url(${data.pictureUri})`
                }}>
                </div>
                <h2 className="title">{data.title} ({data.year})</h2>

              </header>
              <section className="info">
                <ul className="specs">
                  <li>{renderField('runtime', data, 'clock')}</li>
                  <li>{renderField('categories', data, 'tags')}</li>
                  <li>{renderField('score', data, 'star')}</li>
                  <li>{renderField('ageRating', data, 'smile')}</li>
                  <li>{renderField('possessor', data, 'box')}</li>
                  <li>{renderField('plot', data, 'book-open')}</li>
                </ul>

                {
                  state.editMode ? (
                    <div>
                      <button
                        className={classNames({
                          "danger": true,
                          "busy": false
                        })}
                        onClick={() => this.setState({ deleteMovieModalVisible: true })}>
                        <span>Delete movie</span>
                      </button>

                      <DeleteMovieModal
                        movieInfo={state.data}
                        visible={state.deleteMovieModalVisible || state.deleteMovieBusy}
                        busy={state.deleteMovieBusy}
                        onRequestClose={() => this.setState({
                          deleteMovieModalVisible: false
                        })}
                        onAccept={() => this.deleteMovie()} />
                    </div>
                  ) : null
                }

                <h3>Cast ({data.cast.length})</h3>
                <div>
                  <GridList
                    data={data.cast}
                    context="cast"
                    renderItem={actor => (
                      <ActorPreview
                        name={actor.name}
                        role={actor.role}
                        pictureSrc={actor.pictureUri}
                        onClick={() => {
                          ScreenStack.mounted.push(ActorInfoScreen, {
                            actor
                          }, actor.name)
                        }}
                      />
                    )}
                  />
                </div>
              </section>
            </div>
          ) : (
              <div>
                <TaskIndicator />
              </div>
            )
        }
      </div>
    )
  }
}

/**
 * @param {DeleteMovieModalProps} props 
 */
const DeleteMovieModal = (props) => (
  <Modal visible={props.visible} onRequestClose={props.onRequestClose}>
    <div>
      <h2 className="caption">Delete movie?</h2>
      <p className="message">Are you sure you want to delete {props.movieInfo.title} ({props.movieInfo.year})?</p>
      <div className="options">
        <button className={classNames({
          "accept": true,
          "busy": props.busy
        })} onClick={props.onAccept}>Yes</button>
        <button className="decline" onClick={props.onRequestClose}>Cancel</button>
      </div>
    </div>
  </Modal>
)

class DeleteMovieModalProps {
  visible = false;
  busy = false;

  /**
   * @type {Movie}
   */
  movieInfo;

  /**
   * @type {void}
   */
  onRequestClose;

  /**
   * @type {void}
   */
  onAccept;
}