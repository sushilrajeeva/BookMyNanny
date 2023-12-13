import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {loadStripe} from '@stripe/stripe-js';

// using uuid to generate unique transaction id for stripe payment 
// reference - https://dev.to/rahmanfadhil/how-to-generate-unique-id-in-javascript-1b13
// also referred npm uuidv4 documentation -> https://www.npmjs.com/package/uuidv4
import { v4 as uuid } from 'uuid';
// import dotenv from "dotenv";
// dotenv.config();

export function Wallet() {
    const [amount, setAmount] = useState(0);
    const totalBalance = 250;
   

  const handleIncrement = () => {
    setAmount(prevAmount => prevAmount + 1);
  };

  const handleDecrement = () => {
    setAmount(prevAmount => (prevAmount > 0 ? prevAmount - 1 : 0));
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setAmount(Number.isNaN(value) ? 0 : value);
  };

  // Payment Integration
  // I referred the npm documentation for stripe - reference -> https://www.npmjs.com/package/@stripe/stripe-js
  const makePayment = async() =>{
    // Here I am pasting my stripe developer account publishing key
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    //console.log("This is my publishable key - ", publishableKey);
    const stripe = await loadStripe(publishableKey);
    const body = {
        transaction: [
            {
                id: uuid(),
                description: "Add Money to Wallet",
                price: amount
            }
        ]
    }
    const headers = {
        "Content-Type": "application/json"
    }
    const response = await fetch("http://localhost:3000/api/create-checkout-session", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });

    console.log("response i got from server", response);

    // generating sessionID for stripe 
    const session = await response.json();

    const result = stripe.redirectToCheckout({
        sessionId: session.id
    })
    if(result.error){
        console.log("Error in stripe payment", result.error);
    }

  }

  // For the design I am refering to shadcn card - ref -> https://ui.shadcn.com/docs/components/card
  // I am basing my add money to wallet design from the Move Goal card theme in shadcn - ref -> https://ui.shadcn.com/themes


  return (
    <div className="relative min-h-screen py-8">
        {/* for this i referred the shadcn dashboard : total revenue card - ref -> https://ui.shadcn.com/examples/dashboard */}
        <div className="absolute top-0 left-0 p-8"> {/* keeping an absolute postion for my card and padding it appropriately */}
            <Card className="max-w-xs"> {/* Using max-w-xs for a smaller card width - ref -> https://tailwindcss.com/docs/max-width */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Wallet Balance
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-left w-full">${totalBalance.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      This is your current wallet balance
                    </p>
                </CardContent>
            </Card>
        </div>


        <div className="mt-32 mx-auto max-w-xs"> {/* Logic to position my card on center of the screen - ref - https://hackernoon.com/how-to-centre-an-element-in-css-with-tailwind */}
            <Card className="w-full max-w-xs"> {/* Using max-w-xs for a smaller card width */}
                <CardContent className="flex flex-col items-center justify-center p-4">
                    <div className="text-lg font-semibold mb-2">Add Money To Wallet</div>
                    <div className="flex items-center mb-4">
                        <Button 
                            onClick={handleDecrement}
                            className="bg-white text-black font-bold rounded-full w-10 h-10 flex items-center justify-center"
                        >-</Button>
                        <Input 
                            className="mx-2 text-center" 
                            type="number" 
                            value={amount} 
                            onChange={handleChange} 
                            style={{ width: '60px' }} 
                        />
                        <Button 
                            onClick={handleIncrement}
                            className="bg-white text-black font-bold rounded-full w-10 h-10 flex items-center justify-center"
                        >+</Button>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg> */}
                        $ USD
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick = {makePayment}>Add Amount</Button>
                </CardFooter>
            </Card>
        </div>

    </div>
  );
}

export default Wallet;


