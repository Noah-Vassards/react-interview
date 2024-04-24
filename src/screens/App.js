import { useEffect, useState } from 'react';
import '../App.css';
import { movies$ } from '../movies';
import MovieCard from '../components/MovieCard';
import Select from 'react-select';

function App() {
  const [movies, setMovies] = useState([])
  const [paging, setPaging] = useState(12)
  const [pageBegin, setPageBegin] = useState(0)
  const [pageEnd, setPageEnd] = useState(paging)
  const [options, setOptions] = useState([])
  const [filters, setFilters] = useState([])
  const [filteredMovies, setFilteredMovies] = useState(movies)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)

  useEffect(() => {
    async function fetchData() {
      console.log('here')
      try {
        const movieData = await movies$
        console.table(movieData)
        setMovies(movieData)
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let updateOptions = [];
    movies.forEach(movie => {
      if (!updateOptions.some(obj => obj.value === movie.category.toLowerCase())) {
        updateOptions = [...updateOptions, { value: movie.category.toLowerCase(), label: movie.category }]
      }
    })
    console.log(updateOptions)
    setOptions(updateOptions)
    const updateFilters = filters.filter(filter => updateOptions.some(opt => opt.value === filter.value))
    console.log('updateFilters', updateFilters)
    setFilters(updateFilters)
  }, [movies])

  useEffect(() => {
    if (filters.length === 0) {
      setFilteredMovies(movies)
      return
    }
    const updateFilteredMovies = movies.filter(movie => filters.some(obj => obj.value === movie.category.toLowerCase()))
    setFilteredMovies(updateFilteredMovies)
    setPageBegin(0)
    setPageEnd(paging)
  }, [movies, filters])

  useEffect(() => {
    filteredMovies.length <= paging || filteredMovies.length <= pageEnd ? setDisableNext(true) : setDisableNext(false)
    pageBegin === 0 ? setDisablePrev(true) : setDisablePrev(false)
  }, [filteredMovies, paging, pageBegin])

  const handleOnLike = (id, prevLiked, prevDisliked) => {
    const updatedMovies = movies.map(movie => {
      if (movie.id === id) {
        return {
          ...movie,
          likes: prevLiked ? movie.likes - 1 : movie.likes + 1,
          dislikes: prevDisliked ? movie.dislikes - 1 : movie.dislikes
        };
      }
      return movie;
    });

    setMovies(updatedMovies);
  }

  const handleOnDislike = (id, prevLiked, prevDisliked) => {
    const updatedMovies = movies.map(movie => {
      if (movie.id === id) {
        return {
          ...movie,
          likes: prevLiked ? movie.likes - 1 : movie.likes,
          dislikes: prevDisliked ? movie.dislikes - 1 : movie.dislikes + 1
        };
      }
      return movie;
    });

    setMovies(updatedMovies);
  }

  const handleOnDelete = (id) => {
    console.log('filters', filters)
    const updateMovies = movies.filter(movie => movie.id !== id)
    setMovies(updateMovies)
  }

  const handlePrevious = () => {
    if (pageBegin <= 0) {
      setDisablePrev(true)
      return;
    }
    setPageBegin(prevState => prevState - paging)
    setPageEnd(prevState => prevState - paging)
    console.log(pageBegin)
  }

  const handleNext = () => {
    if (pageEnd >= movies.length) {
      setDisableNext(true)
      return;
    }
    setPageBegin(prevState => prevState + paging)
    setPageEnd(prevState => prevState + paging)
    console.log(pageBegin)
  }

  const handlePaging = (newPaging) => {
    setPaging(newPaging)
    setPageBegin(0)
    setPageEnd(newPaging)
  }
  return (
    <div className="App">
      <div className='Body'>
        <div className='Movie-Container-Header'>
          <div style={{ height: '90%', maxWidth: '10%' }}>
            <Select
              options={[{ value: 4, label: 4 }, { value: 8, label: 8 }, { value: 12, label: 12 }]}
              onChange={choice => handlePaging(choice.value)}
              defaultValue={{ value: 12, label: 12 }}
              styles={{
                valueContainer: (provided, state) => ({
                  ...provided,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  flexWrap: 'nowrap',
                  minWidth: '40%'
                }),
                input: (provided, state) => ({
                  ...provided,
                  minWidth: '20%'
                })
              }}
            />
          </div>
          <button onClick={handlePrevious} disabled={disablePrev}>{'<<'}</button>
          <button onClick={handleNext} disabled={disableNext}>{'>>'}</button>
          <div style={{ height: '90%', maxWidth: '30%' }}>
            <Select
              options={options}
              isMulti
              placeholder='Filters'
              onChange={choices => setFilters(choices)}
              value={filters}
              styles={{
                valueContainer: (provided, state) => ({
                  ...provided,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  flexWrap: 'nowrap',
                  minWidth: '40%'
                }),
                input: (provided, state) => ({
                  ...provided,
                  minWidth: '20%'
                })
              }}
            />
          </div>
        </div>
        <div className='Movie-Container'>
          {filteredMovies.slice(pageBegin, pageEnd).map((movie, index) =>
            <MovieCard
              key={index}
              title={movie.title}
              category={movie.category}
              likes={movie.likes}
              dislikes={movie.dislikes}
              onLike={(prevLiked, prevDisliked) => handleOnLike(movie.id, prevLiked, prevDisliked)}
              onDislike={(prevLiked, prevDisliked) => handleOnDislike(movie.id, prevLiked, prevDisliked)}
              onDelete={() => handleOnDelete(movie.id)} />
          )}
        </div>
        <div className='Movie-Container-Footer'>
          <button onClick={handlePrevious} disabled={disablePrev}>{'<<'}</button>
          <button onClick={handleNext} disabled={disableNext}>{'>>'}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
