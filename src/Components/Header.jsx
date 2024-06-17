import "../Styles/Header.css";
import pokeball from "../Images/pokeball.png";

function Header() {
    return (
        <div className="header">
            <div className="pokeballImg">
                <img src={pokeball} alt="Pokeball" />
            </div>
            <div className="title">
                <span className="poke">Poké</span>
                <span className="memo">Memo</span>
            </div>
        </div>
    );
}

export default Header;
