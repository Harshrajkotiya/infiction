import Card from 'react-bootstrap/Card';

function ProfileId() {
    return (
        <Card className='ps-0' style={{ width: '95%', backgroundColor: "#F3AE09", color: "black" }}>
            <Card.Body>
                <Card.Title>Create InFiction ID</Card.Title>
                <div className="d-flex justify-content-center">
                    <img src="../profile_id_img.svg" alt="profile_id_img" />
                </div>
                <div className="d-flex justify-content-center">
                    <h2><b>1254 5214 5254</b></h2>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ProfileId;