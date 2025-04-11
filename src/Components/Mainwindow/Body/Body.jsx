import React from 'react';

const Body = () => {
    const handleClick = () => {
        alert('Bluebanner button clicked!');
    };

    return (
        <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
            <h1>Topbar</h1>
            <button onClick={handleClick}>Click Me</button>
        </div>
    );
}

export default Body;