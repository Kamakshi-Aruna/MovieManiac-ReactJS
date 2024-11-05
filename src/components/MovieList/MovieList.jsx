import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import './MovieList.css';
import MovieCard from './MovieCard';

const MovieList = ({ type, title, emoji }) => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sort, setSort] = useState({
        by: "default",
        order: "asc"
    });

    useEffect(() => {
        fetchMovies();
    }, [type]); 

    useEffect(() => {
        // Filter movies based on the minimum rating
        const filtered = minRating === 0 
            ? movies 
            : movies.filter(movie => parseInt(movie.imdbRating) >= minRating);
        setFilteredMovies(filtered);
    }, [minRating, movies]);

    useEffect(() => {
        // Perform sorting when `sort` state changes
        if (sort.by !== "default") {
            const sortedMovies = _.orderBy(filteredMovies, [sort.by], [sort.order]);
            setFilteredMovies(sortedMovies);
        }
    }, [sort, filteredMovies]);

    const fetchMovies = async () => {
        const response = await fetch(
            `http://www.omdbapi.com/?s=2024&apikey=86c13ee8`
        );
        const data = await response.json();
        
        if (data.Search) {
            const moviesWithRatings = await Promise.all(
                data.Search.map(async (movie) => await fetchMovieDetails(movie.imdbID))
            );
            setMovies(moviesWithRatings);
            setFilteredMovies(moviesWithRatings);
        } else {
            setMovies([]);
            setFilteredMovies([]);
        }
    };

    const fetchMovieDetails = async (imdbID) => {
        const response = await fetch(
            `http://www.omdbapi.com/?i=${imdbID}&apikey=86c13ee8`
        );
        const data = await response.json();
        return data;
    };

    const handleFilter = (rate) => {
        setMinRating(rate);
    };

    const handleSort = (e) => {
        const { name, value } = e.target;
        setSort(prev => ({ ...prev, [name]: value }));
    };

    return (
        <section className="movie_list" id={type}>
            <header className="align_center movie_list_header">
                <h2 className="align_center movie_list_heading">
                    {title} <img src={emoji} alt={`${emoji} icon`} className="navbar_emoji" />
                </h2>

                <div className="align_center movie_list_fs">
                    <ul className="align_center movie_filter">
                        <li className="movie_filter_item" onClick={() => handleFilter(0)}>All</li>
                        <li className="movie_filter_item" onClick={() => handleFilter(8)}>8 Star</li>
                        <li className="movie_filter_item" onClick={() => handleFilter(7)}>7 Star</li>
                        <li className="movie_filter_item" onClick={() => handleFilter(6)}>6 Star</li>
                    </ul>

                    <select name="by" onChange={handleSort} value={sort.by} className="movie_sorting">
                        <option value="default">Sort By</option>
                        <option value="Year">Year</option>
                        <option value="imdbRating">Rating</option>
                    </select>
                    <select name="order" onChange={handleSort} value={sort.order} className="movie_sorting">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </header>
            <div className="movie_cards">
                {
                    filteredMovies.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)
                }
            </div>
        </section>
    );
};

export default MovieList;
