import { useEffect, useState, useCallback } from "react";
import { IoDocument } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

function DataConfirm() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isPolling, setIsPolling] = useState(true);
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    // Fetch customer data function
    const fetchCustomers = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            
            const response = await fetch("http://localhost:3000/api/temp-customer-details", {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch customer data');
            }

            const data = await response.json();
            setCustomers(data);
            setError("");
            setLastUpdate(new Date());
        } catch (err) {
            console.error("Error fetching data", err);
            setError("Failed to load customer data");
        } finally {
            if (showLoader) setLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchCustomers(true);
    }, [fetchCustomers]);

    // Auto-refresh with polling
    useEffect(() => {
        if (!isPolling) return;

        const interval = setInterval(() => {
            fetchCustomers(false); // Don't show loader for background updates
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [fetchCustomers, isPolling]);

    // Handle approve with auto-refresh
    const handleApprove = async (customer) => {
        try {
            const response = await fetch("http://localhost:3000/api/approve/approveCustomer", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer_temp_id: customer.customer_temp_id,
                    temp_customer_name: customer.temp_customer_name,
                    temp_customer_nic: customer.temp_customer_nic,
                    temp_customer_address: customer.temp_customer_address,
                    temp_customer_face_encoding: customer.temp_customer_face_encoding,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Approval failed");
            }

            const result = await response.json();
            console.log("Approval successful:", result);

            // Refresh data after approval
            await fetchCustomers(false);
            
            navigate("/success", { replace: true });
        } catch (error) {
            console.error("Approval error:", error);
            alert("Failed to approve customer: " + error.message);
        }
    };

    const handleReject = async (customerId) => {
        try {
            // Add your reject API call here
            console.log("Rejected customer:", customerId);
            
            // Refresh data after rejection
            await fetchCustomers(false);
        } catch (error) {
            console.error("Rejection error:", error);
            alert("Failed to reject customer: " + error.message);
        }
    };

    // Manual refresh function
    const handleManualRefresh = () => {
        fetchCustomers(true);
    };

    // Toggle auto-refresh
    const toggleAutoRefresh = () => {
        setIsPolling(!isPolling);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#ed1b24] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading customer data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                    <p className="font-medium mb-3">Error: {error}</p>
                    <button
                        onClick={handleManualRefresh}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8 px-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ed1b24] opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ed1b24] opacity-5 rounded-full transform -translate-x-32 translate-y-32"></div>

            <div className="max-w-6xl mx-auto">
                {/* Header with refresh controls */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Customer Data Confirmation</h1>
                    <p className="text-gray-600 text-lg">Review and approve pending customer registrations</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#ed1b24] to-red-700 mx-auto mt-4 rounded-full"></div>
                    
                    {/* Refresh Controls */}
                    {/* <div className="flex justify-center items-center space-x-4 mt-6">
                        <button
                            onClick={handleManualRefresh}
                            className="flex items-center space-x-2 bg-white/70 hover:bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-sm text-gray-600">Refresh</span>
                        </button>
                        
                        <button
                            onClick={toggleAutoRefresh}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                                isPolling 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                            <span className="text-sm">Auto-refresh {isPolling ? 'ON' : 'OFF'}</span>
                        </button>
                        
                        <div className="text-xs text-gray-500 bg-white/50 px-3 py-2 rounded-lg">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </div>
                    </div> */}
                </div>

                {/* Customer Cards */}
                {customers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg mb-4">No pending customer confirmations</p>
                        <p className="text-gray-400 text-sm">
                            {isPolling ? 'Automatically checking for new data...' : 'Auto-refresh is disabled'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {customers.map((customer, index) => (
                            <div
                                key={customer.customer_temp_id}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="lg:flex">
                                    {/* Left Side - Customer Details */}
                                    <div className="lg:w-2/3 p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                                    {customer.temp_customer_name}
                                                </h2>
                                                <div className="flex items-center space-x-2">
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                                                        Pending Approval
                                                    </span>
                                                    <span className="text-gray-500 text-sm">
                                                        ID: #{customer.customer_temp_id}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-[#ed1b24]/10 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-[#ed1b24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0V4a2 2 0 014 0v2" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">NIC Number</p>
                                                        <p className="text-gray-800 font-semibold">{customer.temp_customer_nic}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-10 h-10 bg-[#ed1b24]/10 rounded-full flex items-center justify-center mt-1">
                                                        <svg className="w-5 h-5 text-[#ed1b24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">Address</p>
                                                        <p className="text-gray-800 font-semibold leading-relaxed">
                                                            {customer.temp_customer_address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
                                            <div className="flex items-center mt-10 mx-1 gap-4 mb-6">
                                                <input id="link-checkbox" type="checkbox" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue" required />
                                                <label htmlFor="link-checkbox" className="ms-2 mt-[-6px] text-sm font-medium text-gray-900">
                                                    I agree to the storage and use of my photograph as described in terms and conditions
                                                </label>
                                            </div>
                                        </form>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleApprove(customer)}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200"
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Approve</span>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleReject(customer.customer_temp_id)}
                                                className="flex-1 bg-gradient-to-r from-[#ed1b24] to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-200"
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span>Reject</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Side - Customer Image */}
                                    <div className="lg:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#ed1b24]/20 to-red-700/20 rounded-2xl transform rotate-3"></div>
                                            <div className="relative bg-white p-2 rounded-2xl shadow-lg">
                                                <img
                                                    src={customer.temp_customer_face_encoding}
                                                    alt={`${customer.temp_customer_name}'s photo`}
                                                    className="w-64 h-64 object-cover rounded-xl"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwQzExNi41NjkgMTAwIDEzMCA4Ni41Njg1IDEzMCA3MEM1MyA1My40MzE1IDM5LjgzMjMgNzAgMjMuNzY0IDcwIDEwIDc2LjU2ODUgMTAgOTAgMTAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDEyMEM4Ni41Njg1IDEyMCA3MyAxMzMuNDMxIDczIDE0N0M3MyAxNjAuNTY5IDg2LjU2ODUgMTc0IDEwMCAxNzQiIGZpbGw9IjlDQTNBRi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzExMy40MzEgMTIwIDEyNyAxMzMuNDMxIDEyNyAxNDdDMTI3IDE2MC41NjkgMTEzLjQzMSAxNzQgMTAwIDE3NCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                                    }}
                                                />
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#ed1b24] rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out both;
                }
            `}</style>
        </div>
    );
}

export default DataConfirm;