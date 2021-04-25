// import { Redirect, useHistory, Link } from "react-router-dom";
import "../scss/header.scss";

function Header(props) {
    const { currentUser } = props;
    // let history = useHistory();
    // console.log(history);

    function handleLogout(e) {
        //e.prevent.default();
        localStorage.removeItem("currentUser");
        // <Redirect to="/" />;
        window.location.href = "/";
        // history.push("/");
    }

    return (
        <header className="header">
            <div className="header__left">
                <p className="header__logo">&</p>
                <p className="header__title">deviceChecker</p>
            </div>
            <div className="header__right">
                {currentUser && (
                    <>
                        <p className="header__username">{currentUser.login}</p>
                        <button onClick={handleLogout} className="header__btn">
                            Odhlásit
                        </button>
                    </>
                )}
                {currentUser && currentUser.type === "admin" && (
                    <button
                        className="header__btn"
                        onClick={() =>
                            (window.location.href = "/create-device")
                        }
                    >
                        Přidat zařízení
                    </button>
                )}
                {!currentUser && (
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="header__btn"
                    >
                        Přihlásit
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
