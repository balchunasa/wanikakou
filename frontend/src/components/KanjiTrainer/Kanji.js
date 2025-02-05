import { useState, useEffect } from "react";


function Kanji({ character, characterPath }) {
    const [show, setShow] = useState(false);

    const handleShow = (e) => {
        if (e.key === "s" || e.key === "S") setShow(prev => !prev);
    }

    useEffect(() => {
        setShow(false);
    }, [characterPath]);

    useEffect(() => {
        document.addEventListener("keydown", handleShow);

        return (() => {
            document.removeEventListener("keydown", handleShow);
        });
    }, []);

    return (
        <>
        <h3>Current Kanji</h3>
        {show && characterPath.length !== 0 ? <svg version="1.1" width="6.8125rem" height="6.8125rem" viewBox="0 0 109 109">
            {characterPath.map((path, index) => (
                <path key={index} d={path} />
            ))}
        </svg>
        : show ? <span style={{fontSize: 85}}> {character} </span> : <h1 style={{fontSize: 85}}> ? </h1>
        }
        </>
    );
}

export default Kanji;