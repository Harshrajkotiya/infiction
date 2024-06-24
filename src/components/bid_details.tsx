import React from 'react'

export default function bid_details(props) {
    
    return (
        <>
            <style jsx>
                {`
                label{
                    color:black;
                    font-size:1rem;
                }
                button{
                    background-color:rgb(243, 174, 9);
                }
                button:hover{
                    border-color:rgb(243, 174, 9);
                    background-color:none;
                    color: rgb(243, 174, 9);
                    font-weight: bolder;
                    
                }
                `}
            </style>

            <div className="card" style={{ width: "18rem", backgroundColor:"black"}}>
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <p className="card-text fw-bolder text-light" style={{fontSize:"1.1rem"}}>Reserved Price</p>
                        <p className="card-text text-light" style={{fontSize:"1.1rem"}}>₹{props.amount}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="card-text fw-bolder text-light" style={{fontSize:"1.1rem"}}>Bid amount</p>
                        <p className="card-text text-light" style={{fontSize:"1.1rem"}}>₹{props.bidAmount}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="card-text fw-bolder text-light" style={{fontSize:"1.1rem"}}>Payment <br /><span className="text-muted" style={{fontSize:"0.9rem"}}>5% of bid amount</span></p>
                        <p className="card-text text-light" style={{fontSize:"1.1rem"}}>₹{parseInt(props.bidAmount) * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100)}</p>
                    </div>
                    <button
                        type="button"
                        className="btn btn btn-outline"
                        onClick={props.onClose}
                    >
                        Confirm Bid
                    </button>
                </div>
            </div>
        </>
    )
}
