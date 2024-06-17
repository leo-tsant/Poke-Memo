import "../Styles/Content.css";
import axios from "axios";
import { useState, useEffect } from "react";
import pokeball from "../Images/pokeball-ico.ico";

function Content() {
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clickedPokemonList, setClickedPokemonList] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [playAgain, setPlayAgain] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const getNumberOfPokemons = await axios.get("https://pokeapi.co/api/v2/pokemon-species/?limit=0");
                const numberOfPokemons = getNumberOfPokemons.data.count;
                const pokemonIds = [];
                const usedPokemonIds = new Set(); // To avoid using the same pokemon id

                for (let i = 0; i < 18; i++) {
                    let id = Math.floor(Math.random() * numberOfPokemons) + 1;
                    while (usedPokemonIds.has(id)) {
                        id = Math.floor(Math.random() * numberOfPokemons) + 1;
                    }
                    usedPokemonIds.add(id);
                    pokemonIds.push(id);
                }
                const pokemonPromises = pokemonIds.map(async (id) => {
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    return response.data;
                });
                // Add 3 second timeout to simulate loading
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const pokemonData = await Promise.all(pokemonPromises);
                setPokemonList(pokemonData);
                setScore(0);
            } catch (error) {
                setError(error);
                console.error("Error fetching Pokemon:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [playAgain]);

    const shufflePokemonCards = (array) => {
        let currentIndex = array.length,
            randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    const handleCardClick = (event) => {
        if (clickedPokemonList.includes(event.target.alt)) {
            setClickedPokemonList([]);
            if (score >= highScore) {
                setHighScore(score);
            }
            setGameOver(true);
        } else {
            setClickedPokemonList((prevState) => [...prevState, event.target.alt]);
            setScore((prevState) => prevState + 1);
            if (score === 17) {
                setGameWon(true);
                if (score >= highScore) {
                    setHighScore(score + 1);
                }
            }
            setPokemonList(shufflePokemonCards(pokemonList));
        }
    };

    const handlePlayAgain = () => {
        setClickedPokemonList([]);
        setGameOver(false);
        setGameWon(false);
        if (score >= highScore) {
            setHighScore(score);
        }
        setPlayAgain(!playAgain);
    };

    return (
        <div className="content">
            {isLoading && (
                <div className="loading">
                    <img src={pokeball} alt="Loading Pokeball" className="pokeball" />
                    <div className="loadingText">Loading Pokémon...</div>
                </div>
            )}
            {error && <div className="error">Error fetching Pokemon</div>}
            {!isLoading && !error && (
                <div className="scoreCard">
                    <div>Score: {score}</div>
                    <div>High Score: {highScore}</div>
                </div>
            )}

            <div className="pokemonCards">
                {!isLoading &&
                    !error &&
                    pokemonList.map((pokemon) => (
                        <button className="pokemonCard" key={pokemon.name} onClick={handleCardClick}>
                            <img src={pokemon.sprites.front_default} alt={pokemon.name} width="200" />
                            <div className="pokemonName">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
                        </button>
                    ))}
            </div>
            {gameOver && (
                <div className="gameOver">
                    <div className="gameOverText">Game Over!</div>
                    <div className="score">Score: {score}</div>
                    <div className="highScore">High Score: {highScore}</div>
                    <button className="playAgain" onClick={handlePlayAgain}>
                        Play Again?
                    </button>
                </div>
            )}
            {gameWon && (
                <div className="gameWon">
                    <div className="gameWonText">Congratulations!</div>
                    <div className="score">Score: {score}</div>
                    <div className="highScore">High Score: {highScore}</div>
                    <button className="playAgain" onClick={handlePlayAgain}>
                        Play Again?
                    </button>
                </div>
            )}
        </div>
    );
}

export default Content;
