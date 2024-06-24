import React, { useEffect, useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { processSubscription } from '@/utils/payment';
import { Auth } from 'aws-amplify';
import { processGetuser } from '@/lib/users';
import { AuthenticateUser } from '@/utils/protecteRoutes';

export default function Plan_price({ plans }) {
  const [user, setUser] = useState(null);
  // console.log("plans", plans);

  // plans.reverse()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const user = await AuthenticateUser();
      if (!user) {
        setIsLoading(true);
      } else {
        setUser(user)
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  return (
    <>
      <style jsx>{`
          *{
            font-family: "courier";
          }
          
          .two { 
            list-style-type: circle;
           
         }
      
         .top_menu{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            color: white;
            padding-top: 0;
            padding-bottom: 30px;
            height: 100vh;
            background: black
         }
         .top_content{
            padding-top: 0;
            padding-bottom: 20px;
         }
         .top_content h2{
            padding-top: 20px;
            font-size: 45px;
             font-weight: bold;
         }
         .menu_box{
            padding-bottom: 60px;
            border-radius: 15px;
            padding-top: 0px;
            height: auto;
            background: white;
         }
        
        
          .price{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 12%;
            
          }

          .price h6{
            font-size: small;
            font-weight: bold;
          }
          .price h3{
           font-size: xx-large;
            font-weight: bolder;

          }
          .price del{
            
            font-size: x-large;
             margin-right: 6px;
 
           }
          

          .box {
            position: relative;
            max-width: 600px;
            width: 90%;
            height: 400px;
            background: #fff;
            box-shadow: 0 0 15px rgba(0,0,0,.1);
          }
          .ribbon {
            width: 150px;
            height: 150px;
            overflow: hidden;
            position: absolute;
            zIndex: 999;
            padding: 2px;
          }
          .ribbon span {
            position: absolute;
            display: block;
            width: 225px;
            padding: 15px 0;
            background-color: #f3ae09;
            box-shadow: 0 5px 10px rgba(0,0,0,.1);
            color: #000;
            font: 700 18px/1 'Lato', sans-serif;
            text-shadow: 0 1px 1px rgba(0,0,0,.2);
            text-transform: uppercase;
            text-align: center;
          }
          
          .ribbon-top-left span {
            right: 6px;
            top: 15px;
            padding: 12px;
            transform: rotate(-45deg);
          }

          .card-body{
            
            margin-bottom:4px;
            margin-left: 20px !important;
            margin-right: 20px !important;

          }
          .price_btn{
            position: absolute;
            bottom: 10px;   
            width:96% !important;
          }
          .card-body .body:hover{
            margin-left: 20px !important;
            margin-right: 20px !important;
          }
          .card_hover{
            height:500px;
            border-color: black;
            background-color: white;
          }

          .card_hover:hover {
            border-color: #f3ae09;
            text-color:black;
            background-color: #f3ae09;
            color: #f3ae09;
          }
          
          .card_hover:hover button.price_btn {
            background-color: black !important;
            color: white !important;
          }
          .card_hover li {
           list-style: none; margin: 1em 0;
          }

          .card_hover:hover .ribbon span{
            color: white;   
            background-color: black !important;
          }
          
           ul {
            
             padding-left: 0rem; 
        }
        li{
            font-weight: 600;
        }
          ul {
            padding-left:opx;
             list-style: none;
             } 

             ul li:before {
                 content: '✓';
                 content-color: #000 !important;
                 border: 0px solid #f3ae09;
                 background: #f3ae09;
                 padding: 4px;
                 width: 28px;
                 text-align: center;
                 border-radius: 100%;
                }
                
                .card_hover:hover ul li::before {
                    content: '✓';
                    color: #ffffff !important;
                    border: 0px solid #000000;
                    background: #000000;
                   }
          
          

        `}
      </style>
      {(isLoading === false) && (

        <div className=" top_menu container-fluid">
          <div className='top_content container'>
            <h2>Plans & Pricing</h2>
            <p>Lorem ipsum dolor sit amet consectetur.
              Aenean integer enim purus nam faucibus augue. </p>
          </div>
          <div className='menu_box container'>
            <div className="row" style={{
              paddingLeft: '0px',
              paddingRight: '0px'
            }}>
              {plans.map((item) => (
                <div className="col-lg-4 col-md-12 col-sm-12 mt-5" key={item.id}>
                  <div className='justify-content-md-center'>
                    <div className="card text-black card_hover">

                      <div className="card-body" style={{
                        position: 'relative'
                      }}>
                        <div>
                          <div className='price'>
                            <h3>₹{item.price}</h3>
                            <h6>/{item.interval}</h6>
                          </div>

                        </div>
                        <h2 style={
                          {
                            fontWeight: 'bold'
                          }
                        }>{item.name}</h2>
                        <p style={
                          {
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }
                        }>{item.description}</p>
                        <ul>
                          <li> {item.screenplay} screenplays in a month</li>
                          <li> {item.discount}% on holding price</li>
                          <li> 10 Team Members</li>

                        </ul>
                        <div>
                          <button className="btn btn-warning price_btn" onClick={() => processSubscription(item.id, user?.attributes?.sub)}>

                            {item.is_bought === true ? "view Plan" : "Choose Plan"}
                          </button>

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}


            </div>
          </div>
        </div>
      )}
    </>


  )
}

export const getStaticProps = async () => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const productPromises = prices.map(async (price) => {
    const product = await stripe.products.retrieve(price.product);

    return {
      id: price.id,
      name: product.name,
      price: price.unit_amount / 100,
      interval: price.recurring.interval,
      currency: price.currency,
      discount: product.metadata?.discount,
      screenplay: product.metadata?.screenplay,
      description: product.description,
      product: price.product,
    };
  });

  const plans = await Promise.all(productPromises);

  return {
    props: {
      plans,
    },
  };
};

