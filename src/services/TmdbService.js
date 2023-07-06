export default class TmdbService {
  baseUrl = 'https://api.themoviedb.org/3/'

  apiKey = 'afd2636738a1f7ebde459a2c19fe4930'

  async getResource(url) {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }

    const body = await response.json()
    return body
  }

  async getMoviesInfo(value = 'return', pageNumber = 1) {
    const result = await this.getResource(
      `${this.baseUrl}search/movie?api_key=${this.apiKey}&language=en-US&page=${pageNumber}&query=${value}`
    )
    return this.transformResultObj(result)
  }

  async getGenres() {
    const result = await this.getResource(`${this.baseUrl}genre/movie/list?api_key=${this.apiKey}&language=en-US`)
    return result.genres
  }

  async getPopularMovies(pageNumber = 1) {
    const result = await this.getResource(
      `${this.baseUrl}movie/popular?api_key=${this.apiKey}&language=en-US&page=${pageNumber}`
    )
    return this.transformResultObj(result)
  }

  async guestSession() {
    const result = await this.getResource(`${this.baseUrl}authentication/guest_session/new?api_key=${this.apiKey}`)
    return result.guest_session_id
  }

  async getRatedMovies(guestSessionId, pageNumber = 1) {
    const result = await this.getResource(
      `${this.baseUrl}guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&page=${pageNumber}`
    )
    return this.transformResultObj(result)
  }

  async setMovieRating(id, guestSessionId, rate) {
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`
    const body = {
      value: rate,
    }
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(body),
    })
  }

  async deleteRatedMovie(id, guestSessionId) {
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`
    await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    })
  }

  transformResultObj(result) {
    const totalItems = result.total_results > 10000 ? 10000 : result.total_results
    const results = result.results.map((movieObj) => {
      const newMovieObj = {
        id: movieObj.id,
        overview: movieObj.overview,
        originalTitle: movieObj.original_title,
        releaseDate: movieObj.release_date,
        posterPath: movieObj.poster_path,
        genreIds: movieObj.genre_ids,
        generalRating: movieObj.vote_average,
      }
      if ('rating' in movieObj) newMovieObj.rating = movieObj.rating
      return newMovieObj
    })
    return {
      results,
      totalItems,
    }
  }
}
