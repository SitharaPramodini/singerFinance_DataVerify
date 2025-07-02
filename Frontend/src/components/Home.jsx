import React, { useState, useEffect } from "react";
import Header from "./Header";
import { IoDocument } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState({ customer_name: "", customer_number: "", customer_nic: "" , image_path: ""});

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios.get(`https://demo.secretary.lk/fr_apis/fetch_customer_details.php?customer_id=${id}`)
                .then(response => {
                    const { customer_name, customer_number, customer_nic, image_path } = response.data;
                    setUserData({ customer_name, customer_number, customer_nic, image_path });
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [id]);

    const handleAccept = (e) => {
        e.preventDefault();
        console.log("Form submitted");
        navigate("/success", { replace: true });
      };
      

    return (
        <div>
            <Header />
            <div className="mt-[8rem] pt-3 pb-4 bg-white absolute rounded-t-3xl h-auto px-8">
                <img
                    src={userData.image_path || "default.jpg"}
                    className="w-44 h-44 mx-auto mt-[-4rem] rounded-full hover:w-64 hover:h-64 transition-all duration-500 ease-in-out"
                />
                <h1 className="mt-8 mb-4 text-2xl font-bold leading-none tracking-tight text-center text-gray-500">{userData.customer_name || 'sithara'}</h1>
                <p className="text-md my-2 font-semibold text-gray-400 text-center">{userData.customer_nic || "200987887676"}</p>
                <p className="text-md my-2 font-semibold text-gray-400 text-center">{userData.customer_number || "0778909889"}</p>

                <div className="rounded-3xl mt-10 w-full bg-white my-2 overflow-hidden shadow-md">
                    <div
                        className="flex justify-between items-center px-4 py-3 cursor-pointer"
                        onClick={toggleAccordion}
                    >
                        <p className="text-gray-500 text-md font-bold flex items-center gap-6">
                            <IoDocument className="text-xl text-gray-500" />
                            Terms and conditions
                        </p>
                    </div>
                    <div
                        className={`transition-all px-4 duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 p-4 bg-white text-gray-600' : 'max-h-0 p-0'}`}
                    >
                        <p>
                            Please be informed that this branch records photographs for security, customer verification, and fraud prevention purposes. This is done in compliance with the Data Protection Act of Sri Lanka, ensuring that your personal data is handled securely and used only for legitimate purposes.
                        </p>
                        <br />
                        <p>
                            If you have any concerns or require further information, please contact our customer service team.
                        </p>
                    </div>
                </div>

                <form>
    <div className="flex items-start mt-10 mx-1 gap-4">
        <input id="link-checkbox" type="checkbox" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue" required />
        <label htmlFor="link-checkbox" className="ms-2 mt-[-6px] text-sm font-medium text-gray-900">
            I agree to the storage and use of my photograph as described in terms and conditions
        </label>
    </div>

    <button onClick={() => navigate("/success", { replace: true })}  className="w-full mt-8 mb-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center">
        I Accept
    </button>
</form>

<p className=" bg-white font-medium bottom-0 w-full text-center text-gray-400">
                    SmartConnect product
                </p>
            </div>
        </div>
    );
}

export default Home;
