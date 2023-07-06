import React from 'react'
import './Card.css'
import { Rate, Card } from 'antd'
import { format } from 'date-fns'
import PropTypes from 'prop-types'

import 'inter-ui/inter.css'
import { Consumer } from '../../context/TMDBServiceContext'
import GenresList from '../GenresList'

import noPoster from './image-not-found.jpg'

class MovieCard extends React.Component {
  state = {
    starsRate: this.props.rating,
  }

  onStarsChange = (value) => {
    this.setState({
      starsRate: value,
    })
    const { onRateChange } = this.props
    onRateChange(value)
  }

  cutString = (string, maxLength) => {
    if (string.length > maxLength) {
      const shortenString = string.substr(0, maxLength)
      return `${shortenString.substr(0, Math.min(shortenString.length, shortenString.lastIndexOf(' ')))} ...`
    }
    return string
  }

  render() {
    const { overview, originalTitle, releaseDate, posterPath, genreIds, generalRating } = this.props

    const { starsRate } = this.state

    const imageUrl = posterPath ? `https://image.tmdb.org/t/p/original${posterPath}` : noPoster
    const story = this.cutString(overview, 203)
    const formattedDate = releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy') : null
    let progressClassNames = 'header__progress'
    if (generalRating >= 3 && generalRating < 5) {
      progressClassNames += ' orange'
    }
    if (generalRating >= 5 && generalRating < 7) {
      progressClassNames += ' yellow'
    }
    if (generalRating >= 7) {
      progressClassNames += ' green'
    }

    return (
      <Card hoverable className="card">
        <div className="card__image">
          <img alt={`movie ${originalTitle}`} src={imageUrl} />
        </div>
        <div className="card__header">
          <div className="header__title">{originalTitle}</div>
          <div className={progressClassNames}>{Math.round(generalRating * 10) / 10}</div>
        </div>
        <div className="card__release-date">{formattedDate}</div>
        <Consumer>
          {(genres) => (
            <div className="card__genres-list">
              <GenresList genreIds={genreIds} genres={genres} />
            </div>
          )}
        </Consumer>
        <div className="card__story">{story}</div>
        <div className="card__rate">
          <Rate
            allowHalf="true"
            count="10"
            value={starsRate}
            onChange={this.onStarsChange}
            style={{ fontSize: '18px' }}
          />
        </div>
      </Card>
    )
  }
}

Card.propTypes = {
  overview: PropTypes.string,
  originalTitle: PropTypes.string,
  genreIds: PropTypes.array,
  generalRating: PropTypes.number,
  releaseDate: PropTypes.string,
  posterPath: PropTypes.string,
}

export default MovieCard
