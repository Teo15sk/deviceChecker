import { DateTime } from "luxon";
import { useState } from "react";
import placeholderImage from "../images/nope-not-here.jpg";
import "../scss/device.scss";

function Device(props) {
    const { device, currentUser, token, fetchDevices } = props;
    const [message, setMessage] = useState("");

    async function borrowReturnDevice(deviceId, type) {
        const response = await fetch(
            `https://js-test-api.etnetera.cz/api/v1/phones/${deviceId}/${type}`,
            {
                method: "POST",
                // body: JSON.stringify(request_data),
                headers: {
                    Accept: "application/json",
                    // "Content-type": "application/json",
                    "Auth-Token": `${token}`,
                },
            }
        );

        const response_data = await response.json();
        // console.log(response_data);
        if (response_data.error) {
            setMessage(response_data.error);
        } else {
            // window.location.href = "/";
        }
    }

    async function handleBorrowDevice(e) {
        await borrowReturnDevice(e, "borrow");
        fetchDevices();
    }

    async function handleReturnDevice(e) {
        await borrowReturnDevice(e, "return");
        fetchDevices();
    }

    return (
        <div className="device-item__container">
            {message && <p className="error-msg">{message}</p>}
            <img
                className="device-item__img"
                src={device.image ? device.image : placeholderImage}
                alt={device.model}
            />
            {device.borrowed && (
                <div className="device-item__borrowed">
                    Vypůjčeno: {device.borrowed.user.name},{" "}
                    {DateTime.fromMillis(device.borrowed.date).toFormat(
                        "d.M.y H:mm"
                    )}
                </div>
            )}
            <div className="device-item__bottom">
                <div className="device-item__device">
                    <div className="device-item__model">{device.model}</div>
                    <div className="device-item__vendor">{device.vendor}</div>
                </div>
                <div className="device-item__os">
                    {device.os} {device.osVersion && `/ ${device.osVersion}`}
                </div>
                {!device.borrowed ? (
                    <button
                        className="device-item__btn device-item__btn--borrow"
                        onClick={() => {
                            handleBorrowDevice(device.id);
                        }}
                    >
                        Půjčit
                    </button>
                ) : device.borrowed.user.id === currentUser.id ? (
                    <button
                        className="device-item__btn device-item__btn--return"
                        onClick={() => {
                            handleReturnDevice(device.id);
                        }}
                    >
                        Vrátit
                    </button>
                ) : (
                    <button
                        className="device-item__btn device-item__btn--disabled"
                        disabled
                    >
                        Půjčit
                    </button>
                )}
            </div>
        </div>
    );
}

export default Device;
