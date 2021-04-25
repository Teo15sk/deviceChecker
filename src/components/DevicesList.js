import { useEffect, useState } from "react";
import Device from "./Device";
import "../scss/deviceslist.scss";
import { useHistory } from "react-router-dom";
<script
    src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"
    defer
></script>;

function DevicesList(props) {
    const [devicesList, setDevicesList] = useState([]);
    const [searchOs, setSearchOs] = useState("");
    const [searchVendor, setSearchVendor] = useState("");
    const [filteredSystems, setFilteredSystems] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    let history = useHistory();

    let filteredResults = filteredSystems.filter((device) =>
        filteredVendors.includes(device)
    );

    console.log(devicesList);
    console.log(filteredSystems);
    console.log(filteredVendors);
    console.log(filteredResults);

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
        console.log(data);
    }

    useEffect(() => {
        fetchDevices();
    }, []);

    useEffect(() => {
        setFilteredSystems(
            devicesList.filter((device) => {
                return device.os.toLowerCase().includes(searchOs.toLowerCase());
            })
        );
    }, [searchOs, devicesList]);

    useEffect(() => {
        setFilteredVendors(
            devicesList.filter((device) => {
                return device.vendor
                    .toLowerCase()
                    .includes(searchVendor.toLowerCase());
            })
        );
    }, [searchVendor, devicesList]);

    function handleSearchSystem(e) {
        console.log(e.target.value);
        setSearchOs(e.target.value);
    }

    function handleSearchVendor(e) {
        console.log(e.target.value);
        setSearchVendor(e.target.value);
    }

    if (!props.currentUser) {
        // <Redirect to="/devices" />;
        // window.location.href = "/";
        history.push("/");
    }

    return (
        <>
            <div className="search-filter__container">
                <div className="search-filter__item">
                    <label htmlFor="system">Systém</label>
                    <input
                        type="text"
                        name="system"
                        placeholder="Nezáleží"
                        onChange={handleSearchSystem}
                    />
                </div>
                <div className="search-filter__item">
                    <label htmlFor="vendor">Výrobce</label>
                    <input
                        type="text"
                        name="vendor"
                        placeholder="Nezáleží"
                        onChange={handleSearchVendor}
                    />
                </div>
            </div>
            <div className="devices-list__container">
                {filteredResults &&
                    filteredResults.map((device) => (
                        <Device
                            device={device}
                            key={device.id}
                            currentUser={props.currentUser}
                            token={props.token}
                            fetchDevices={fetchDevices}
                        />
                    ))}
            </div>
        </>
    );
}

export default DevicesList;
