import { useLocation } from "react-router-dom";
import { Link } from "react-router";
import { Container, ListGroup } from "react-bootstrap";

function Error({ message }) {
    const location = useLocation();

    return (
        <Container className="d-flex flex-column align-items-center text-center">
        <h1>Oops!</h1>
        <p>There was a problem with your submission.</p>
        <p>{ location.state.message }</p>
        <ListGroup className="mb-2" style={{width: "5%"}}>
        {location.state.missingKanji.map((kanji, index) => (
            <ListGroup.Item key={index}>{kanji}</ListGroup.Item>
        ))}
        </ListGroup>
        <Link to="/">Back to Start</Link>
        </Container>
    );
}

export default Error;