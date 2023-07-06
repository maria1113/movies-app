import React from 'react'
import PropTypes from 'prop-types'

import MovieCard from '../Card'

import './CardList.css'

function CardList({ movies, onRateChange, ratedMovies }) {
  const getRatingValue = (movieId) => {
    const ratedMovie = ratedMovies.find(({ id }) => id === movieId)
    const rating = ratedMovie ? ratedMovie.rating : 0
    return rating
  }
  const cardList = movies.map(({ rating, ...movieProps }) => {
    const ratingValue = typeof rating === 'undefined' ? getRatingValue(movieProps.id) : rating
    return (
      <MovieCard
        key={movieProps.id}
        {...movieProps}
        onRateChange={(rate) => onRateChange(movieProps.id, rate)}
        rating={ratingValue}
      />
    )
  })
  return <div className="card-list">{cardList}</div>
}

CardList.propTypes = {
  movies: PropTypes.array.isRequired,
  ratedMovies: PropTypes.array.isRequired,
  onRateChange: PropTypes.func.isRequired,
}

export default CardList
