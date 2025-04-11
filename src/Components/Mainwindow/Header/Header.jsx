import React, { useState } from 'react';

const Header = () => {
    const [count, setCount] = useState(0);

    return (
        <div style={{ padding: '10px', backgroundColor: '#d0d0d0' }}>
            <h1>Header</h1>
            <p>Button clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

export default Header;