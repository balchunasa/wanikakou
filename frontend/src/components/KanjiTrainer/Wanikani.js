import { Container, Row } from "react-bootstrap";

function Wanikani({ title, meanings }) {
    return (
        <Container>
            <Row>
                <h3>{title}</h3>
            </Row>
            <Row>
                <p>{title !== meanings.primary[0] ? `Definition: ${meanings.primary} ` : ""} {meanings.alternative ? <span>Alternatives: {meanings.alternative}</span> : ""}</p>
            </Row>
        </Container>
    );
}

export default Wanikani