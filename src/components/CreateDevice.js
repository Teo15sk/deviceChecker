import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import "../scss/createdevice.scss";

function CreateDevice(props) {
    const [{ code, os, vendor, model, osVersion, image }, setValues] = useState(
        {
            code: "",
            os: "",
            vendor: "",
            model: "",
            osVersion: "",
            image: "",
        }
    );

    const [devicesList, setDevicesList] = useState([]);

    const [messages, setMessages] = useState([]);

    let history = useHistory();

    async function fetchDevices() {
        const response = await fetch(
            "https://js-test-api.etnetera.cz/api/v1/phones",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "Auth-Token": `${props.token}`,
                },
            }
        );
        let data = null;
        try {
            data = await response.json();
        } catch (err) {
            console.error(err);
            window.location.href = "/devices";
            return;
        }
        // const data = await response.json();
        setDevicesList(data);
        // console.log(data);
    }

    useEffect(() => {
        fetchDevices();
    }, []);

    let isCodePresent = devicesList.filter((device) => {
        return device.code.toLowerCase() === code.toLowerCase();
    });

    // console.log(isCodePresent.length);

    async function newDevice() {
        let request_data = {
            code: code.toUpperCase(),
            os: os.toUpperCase(),
            vendor: vendor.toUpperCase(),
            model: model,
            osVersion: osVersion,
            image: image,
        };
        // console.log(request_data);
        const response = await fetch(
            "https://js-test-api.etnetera.cz/api/v1/phones",
            {
                method: "POST",
                body: JSON.stringify(request_data),
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "Auth-Token": `${props.token}`,
                },
            }
        );

        const response_data = await response.json();
        console.log(response_data);
        if (response_data.error) {
            setMessages(response_data.error);
        } else {
            // <Redirect to="/devices" />;
            window.location.href = "/devices";
        }
    }
    const handleChange = (event) => {
        const allowed_names = [
                "code",
                "os",
                "vendor",
                "model",
                "osVersion",
                "image",
            ],
            name = event.target.name,
            value = event.target.value;

        if (-1 !== allowed_names.indexOf(name)) {
            setValues((prev_values) => {
                return { ...prev_values, [name]: value };
            });
        }
    };

    function validate() {
        let codeErrorMsg = "",
            osErrorMsg = "",
            vendorErrorMsg = "",
            modelErrorMsg = "";

        if (!code) {
            codeErrorMsg = "Kódové označení je povinná položka";
        }

        if (isCodePresent.length === 1) {
            codeErrorMsg = "Zařízení s daným kódovým označením již existuje";
        }

        if (!os) {
            osErrorMsg = "Operační systém je povinná položka";
        }

        if (!vendor) {
            vendorErrorMsg = "Výrobce je povinná položka";
        }

        if (!model) {
            modelErrorMsg = "Model je povinná položka";
        }

        if (codeErrorMsg || osErrorMsg || vendorErrorMsg || modelErrorMsg) {
            setMessages([
                codeErrorMsg,
                osErrorMsg,
                vendorErrorMsg,
                modelErrorMsg,
            ]);
            return false;
        }
        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        let isValid = validate();
        if (isValid) {
            newDevice();
            setValues({
                code: "",
                os: "",
                vendor: "",
                model: "",
                osVersion: "",
                image: "",
            });
            // <Redirect to="/devices" />;
            window.location.href = "/devices";
        }
    }

    if (!props.currentUser || props.currentUser.type !== "admin") {
        // <Redirect to="/devices" />;
        history.push("/devices");
        // window.location.href = "/devices";
    }

    return (
        <div className="new-device-section">
            <form
                method="post"
                onSubmit={handleSubmit}
                className="new-device-form"
            >
                <div className="new-device-form__heading">Nové zařízení</div>
                <div className="new-device-form__msg-container">
                    {messages &&
                        messages.map((message, index) => (
                            <p className="error-msg" key={index}>
                                {message}
                            </p>
                        ))}
                </div>
                <input
                    type="text"
                    name="code"
                    onChange={handleChange}
                    placeholder="Kódové označení (identifikátor)"
                    className="new-device-form__input"
                />

                <input
                    type="text"
                    name="vendor"
                    onChange={handleChange}
                    placeholder="Výrobce"
                    className="new-device-form__input"
                />

                <input
                    type="text"
                    name="model"
                    onChange={handleChange}
                    placeholder="Model"
                    className="new-device-form__input"
                />

                <input
                    type="text"
                    name="os"
                    onChange={handleChange}
                    placeholder="Operační systém"
                    className="new-device-form__input"
                />

                <input
                    type="text"
                    name="osVersion"
                    onChange={handleChange}
                    placeholder="Verze operačního systému"
                    className="new-device-form__input"
                />
                <input
                    type="text"
                    name="image"
                    onChange={handleChange}
                    placeholder="Obrázek (URL)"
                    className="new-device-form__input"
                />
                <button className="new-device-form__btn" type="submit">
                    Přidat zařízení
                </button>
            </form>
        </div>
    );
}

export default CreateDevice;
