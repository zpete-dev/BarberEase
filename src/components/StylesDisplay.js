import React, { useState, useEffect } from 'react';

export const StylesDisplay = () => {
    const [styles, setStyles] = useState([]);

    useEffect(() => {
        // Fetch styles from the backend
        async function fetchStyles() {
            const response = await fetch('http://localhost:5000/api/styles');
            const data = await response.json();
            setStyles(data);
        }
        fetchStyles();
    }, []);

    return (
        <div>
            <h2>Available Styles</h2>
            <ul>
                {styles.map(style => (
                    <li key={style._id}>
                        <img src={style.imageUrl} alt={style.name} />
                        <p>{style.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
