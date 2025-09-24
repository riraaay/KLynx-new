import { useEffect, useState } from 'react';
import '../../components/css/GlobalContainer.css';
import '../../components/css/DashboardAlt.css';
import '../../components/css/FileMaintenance.css'
import './Doctors.css'
import axios from 'axios';
import React from 'react';  

const TestPage = () => {

    const fruits = ["apple", "orange", "banana", "coconut", "pineapple" ]
    const listItems = fruits.map(fruit => <li>{fruit}</li>);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    
    const users = [
        { id: 1, name: "Anthony Prudente", age: 6 },
        { id: 2, name: "Maria Lopez", age: 10 },
        { id: 3, name: "John Cruz", age: 20 },
        { id: 4, name: "Jane Doe", age: 30 },
        { id: 5, name: "Janine Mendoza", age: 21}
    ];
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().startsWith(search.toLowerCase())
    );

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
    return (
        <div style={{ padding: "20px" }}>
            <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset to page 1 when searching
            }}
            />

            <ul>
                {currentUsers.map(user => (
                    <li key={user.id}>{user.name} - {user.age}</li>
                ))}
            </ul>
            <p>
        Showing {filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1}
        -
        {Math.min(indexOfLastUser, filteredUsers.length)}
        of {filteredUsers.length} entries
      </p>
            <div style={{ marginTop: "10px" }}>
                <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                >
                Prev
                </button>

                {(() => {
                // make an empty array to store buttons
                const pageButtons = [];

                // loop from 1 up to totalPages
                for (let i = 1; i <= totalPages; i++) {
                    pageButtons.push(
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        style={{
                        fontWeight: currentPage === i ? "bold" : "normal",
                        margin: "0 5px"
                        }}
                    >
                        {i}
                    </button>
                    );
                }

                // return the array of buttons
                return pageButtons;
                })()}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                Next
                </button>
            </div>
        </div>
    );
}

export default TestPage;