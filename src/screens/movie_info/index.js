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
    saveBusy: false
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
        <span><span className={`fas fa-${icon}`} role="img"></span></span>
        <input ref={e => e && (e.value = this.getValueForField(field, data))}
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

  renderContent() {
    let { state, renderField } = this;
    let { data } = state;

    return (
      <div className="movie-info">
        {
          data ? (
            <div>
              <header className="hero" style={{
                backgroundImage: `url(${data.pictureUri})`
              }}>
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

                <h3>Cast ({data.cast.length})</h3>
                <div>
                  <GridList
                    data={data.cast}
                    renderItem={actor => (
                      <ActorPreview
                        name={actor.name}
                        pictureSrc={actor.pictureUri}
                        onClick={() => {
                          ScreenStack.mounted.push(ActorInfoScreen, {
                            data: actor
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