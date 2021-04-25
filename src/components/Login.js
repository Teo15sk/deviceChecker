import { useHistory } from "react-router-dom";
import { useState } from "react";
import "../scss/login.scss";

function Login(props) {
    const [{ login, password }, setValues] = useState({
        login: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    let history = useHistory();

    async function loginUser() {
        let request_data = {
            login: login,
            password: password,
        };
        console.log(request_data);
        const response = await fetch(
            "https://js-test-api.etnetera.cz/api/v1/login",
            {
                method: "POST",
                body: JSON.stringify(request_data),
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
            }
        );

        const response_data = await response.json();
        console.log(response_data);
        if (response_data.error) {
            setMessage(response_data.error);
        } else {
            // props.setUserType(response_data.type);
            props.setCurrentUserData(response_data);
            window.location.href = "/devices";
            // history.push("/devices");
            // <Redirect to="/devices" />;
        }
    }

    const handleChange = (event) => {
        const allowed_names = ["login", "password"],
            name = event.target.name,
            value = event.target.value;

        if (-1 !== allowed_names.indexOf(name)) {
            setValues((prev_values) => {
                return { ...prev_values, [name]: value };
            });
        }
    };

    function handleSubmit(event) {
        event.preventDefault();
        loginUser();
    }

    return (
        <div className="login-section">
            <form method="post" onSubmit={handleSubmit} className="login-form">
                <div className="login-form__heading">Přihlášení</div>
                <div className="login-form__subheading">
                    Po přihlášení si budeš moct půjčit telefon, případně vložit
                    nový do seznamu.
                </div>
                <div className="login-form__msg-container">
                    {message ? (
                        <p className="error-msg">{message}</p>
                    ) : (
                        <p>&nbsp;</p>
                    )}
                </div>

                <input
                    type="email"
                    name="login"
                    onChange={handleChange}
                    placeholder="Přihlašovací jméno"
                    className="login-form__input"
                />

                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Heslo"
                    className="login-form__input"
                />

                <button className="login-form__btn" type="submit">
                    Přihlásit se
                </button>
            </form>
        </div>
    );
}

export default Login;
