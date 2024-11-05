import React from 'react';
import './MovieCard.css';
import Star from '../../assets/star.png';

const MovieCard = ({ movie }) => {
    return (
        <a href="" className="movie_card">
            <img
                src={movie.Poster !== 'N/A' ? movie.Poster : ''}
                alt="movie poster"
                className="movie_poster"
            />

            <div className="movie_details">
                <h3 className="movie_details_heading">{movie.Title}</h3>
                <div className="align_center movie_date_rate">
                    <p>{movie.Year}</p>
                    <p>{movie.Type}</p>
                    <span className="rating">
                        {movie.imdbRating || 'N/A'}
                        <img src={Star} alt="star icon" className="card_emoji"/>
                    </span>
                </div>
            </div>
        </a>
    );
};

export default MovieCard;
