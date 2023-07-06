import React from 'react'
import store from 'store'
import { Spin, Alert, Typography, Layout } from 'antd'

import CardList from '../CardList'
import TmdbService from '../../services/TmdbService'
import PaginationComponent from '../Pagination'
import SearchInput from '../SearchInput'
import Header from '../Header'
import { Provider } from '../../context/TMDBServiceContext'

import './App.css'

const { Text } = Typography

export default class App extends React.Component {
  tmdbService = new TmdbService()

  state = {
    error: null,
    genres: [],
    results: [],
    searchContent: '',
    moviesLoaded: false,
    contentLoaded: false,
    genresLoaded: false,
    currentPage: 1,
    guestSessionId: null,
    totalItems: null,
    tab: '1',
    ratedMovies: [],
  }

  componentDidMount() {
    if (!store.get('guestSessionId')) {
      this.createGuestSession()
    } else {
      this.setState({
        guestSessionId: store.get('guestSessionId'),
      })
    }

    this.getPopularMovies()
    this.getGenres()
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchContent, currentPage, tab } = this.state
    if (searchContent !== prevState.searchContent) {
      this.updateMovies(searchContent)
    } else if (currentPage !== prevState.currentPage) {
      this.updateMovies(searchContent, currentPage)
    } else if (tab !== prevState.tab) {
      if (tab === '2') {
        this.setState(
          {
            currentPage: 1,
            tab,
          },
          () => {
            this.getRatedMovies()
          }
        )
      } else if (tab === '1') {
        this.setState(
          {
            currentPage: 1,
            tab,
          },
          () => {
            this.getPopularMovies()
          }
        )
      }
    }
  }

  onError = (error) => {
    this.setState({
      error,
      contentLoaded: true,
      moviesLoaded: true,
    })
  }

  onSearchContentChange = (value) => {
    this.setState({
      searchContent: value,
      moviesLoaded: false,
      currentPage: 1,
    })
  }

  onRateChange = (id, rate) => {
    const { guestSessionId } = this.state
    if (rate === 0) {
      this.tmdbService.deleteRatedMovie(id, guestSessionId).catch(this.onError)
      return
    }
    this.tmdbService.setMovieRating(id, guestSessionId, rate).catch(this.onError)
  }

  onTabChange = (tab) => {
    this.setState({
      searchContent: '',
      contentLoaded: false,
      tab,
    })
  }

  onPageChange = (pageNumber) => {
    this.setState({
      moviesLoaded: false,
      currentPage: pageNumber,
    })
  }

  getGenres() {
    this.tmdbService
      .getGenres()
      .then((result) => {
        this.setState({
          genresLoaded: true,
          genres: result,
        })
      })
      .catch(this.onError)
  }

  getPopularMovies(pageNumber) {
    this.tmdbService
      .getPopularMovies(pageNumber)
      .then(({ results, totalItems }) => {
        this.setState({
          contentLoaded: true,
          moviesLoaded: true,
          totalItems,
          results,
        })
      })
      .catch(this.onError)
  }

  getRatedMovies() {
    const { guestSessionId, pageNumber } = this.state
    this.tmdbService
      .getRatedMovies(guestSessionId, pageNumber)
      .then(({ results, totalItems }) => {
        this.setState({
          contentLoaded: true,
          moviesLoaded: true,
          totalItems,
          ratedMovies: results,
        })
      })
      .catch(this.onError)
  }

  createGuestSession = () => {
    this.tmdbService
      .guestSession()
      .then((id) => {
        store.set('guestSessionId', id)
        this.setState({
          guestSessionId: id,
        })
      })
      .catch(this.onError)
  }

  updateMovies(value, page) {
    const { tab } = this.state
    if (tab === '2') {
      this.getRatedMovies(page)
      return
    }
    if (value === '') {
      this.getPopularMovies(page)
    } else {
      this.tmdbService
        .getMoviesInfo(value, page)
        .then(({ results, totalItems }) => {
          this.setState({
            moviesLoaded: true,
            totalItems,
            results,
          })
        })
        .catch(this.onError)
    }
  }

  render() {
    const {
      error,
      contentLoaded,
      genresLoaded,
      results,
      genres,
      moviesLoaded,
      currentPage,
      totalItems,
      tab,
      searchContent,
      ratedMovies,
    } = this.state

    const { Content } = Layout

    if (error) {
      return <Alert message="Error" description={error.message} type="error" showIcon />
    }
    if (!contentLoaded || !genresLoaded) {
      return (
        <div className="spin-1">
          <Spin tip="loading" size="large" />
        </div>
      )
    }
    const spinner = !moviesLoaded ? (
      <div className="spin-2">
        <Spin tip="loading" size="large" />
      </div>
    ) : null

    const pagination =
      tab === '1' || ratedMovies.length > 0 ? (
        <PaginationComponent onPageChange={this.onPageChange} currentPage={currentPage} totalItems={totalItems} />
      ) : null
    const listAndPagination =
      moviesLoaded && results.length > 0 ? (
        <>
          <CardList
            movies={tab === '1' ? results : ratedMovies}
            onRateChange={this.onRateChange}
            ratedMovies={ratedMovies}
          />
          {pagination}
        </>
      ) : null

    const noResultMessage =
      moviesLoaded && results.length === 0 ? <Text type="secondary">По вашему запросу ничего не найдено</Text> : null

    const searchInput =
      tab === '1' ? <SearchInput onSearchMovies={this.onSearchContentChange} label={searchContent} /> : null
    return (
      <div className="main-container">
        <Layout>
          <Provider value={genres}>
            <Content>
              <Header onChange={this.onTabChange} tab={tab} />
              {searchInput}
              {spinner}
              {listAndPagination}
              {noResultMessage}
            </Content>
          </Provider>
        </Layout>
      </div>
    )
  }
}
