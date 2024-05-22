# 🪷 Lottus. a Help2Earn System on Base
Entry for HackFS2024 By Heritage

## Registry Of changes

**First Commit:** 

  -Deployed the Starter Kit from Scaffold-ETH2 

  -Created the Repository on Github and Uploaded the Starter Kit

  ![Basic Scaffold-ETH2 Layout](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

**Second Commit:** 
  -Started preparing the Layout of What is going to be Lottus

  -Modified the README File

  ![Modified Layout for Lottus](https://firebasestorage.googleapis.com/v0/b/heartventure-18dee.appspot.com/o/Lottus%2Fimagen_2024-05-17_134807331.png?alt=media&token=6c51cf2e-b131-47f0-97dc-9dd3393441e2)

**Third Commit:** 
  -Worked on the Basic Layout of the Dapp. placing components provided by [**DaisyUi**](https://daisyui.com)

  -Added to components, The *CountDown* and the *CounterComponent*, both need some tweaking but it works for getting an idea. 

   ![Basic Layout For Lottus](https://firebasestorage.googleapis.com/v0/b/heartventure-18dee.appspot.com/o/Lottus%2Fimagen_2024-05-17_173746413.png?alt=media&token=237f79c8-847d-42aa-94de-54ada4485d01)

 **Fourth Commit:** 
  -Added 4 new components: 

      -A column where people will be able to see the recent winners, and recent donations done by Lottus.

      -A column where users will be able to fill a form to suggest the next charity we should support.

      -A column where the users will be able to view the NFTs that they can earn as a thank you for participating and the one for the winner.

      -4 FAQ tabs where i explain what Lottus is and how would it work. 

  -No Smart contract has been created yet, this comes in the next Commit. 

   ![More Complex Layout For Lottus](https://firebasestorage.googleapis.com/v0/b/heartventure-18dee.appspot.com/o/Lottus%2Fimagen_2024-05-17_193147892.png?alt=media&token=67670985-0450-4256-a216-958e8a1f82ae)

    **Fifth Commit:** 
  -Creation of a the Base of the smart contract: 

      -It allows the owner to create a Lottus with the info they need like the charity to donate on this lottus, the price, name, etc.

      -It let's the owner Pick a "random" winner, and it updates and saves the winners on an array for using it on the history.

      -It distributes the Funds the following way: 

          -40% to the winner of the Lottus

          -40% to the charity Chosen

          -10% for the owner of the contract

          -10% stays on the Contract to keeps funds for the next Lottus

      -It allows the owner to depostid an initial prize pool in case a Lottus Gets sponsored by another protocol or Dapp

      **At its current state the Smart contract is not able to Produce Actual random Results, this will be implemented later, aswell as posting the banner for each Lottus and minting the NFTs**

  -Started the connection of the smart contract with the front-end, For now, the Name, description, price per ticked, tickets sold, prize pool and counter are connected and change when a new Lottus is Launched. there are some components that change depending if the Lottus is Up or if it is already ended.

 

   ![More Complex Layout For Lottus](https://firebasestorage.googleapis.com/v0/b/heartventure-18dee.appspot.com/o/Lottus%2Fimagen_2024-05-18_003107203.png?alt=media&token=8dd8ba8b-27cc-44de-9a32-b5d8c82b9da5)


   **Sixth Commit:** 
  -Basic Function of buying a ticket is now working on the front end. 

  -New Messages focused on incentivizing the user to continue contributing

  -Since the Project is planned to be Dropped on Base and base does not support chainlink VRF for now, i implemented more bits on the randon function to try and avoid it being exploited.

 ## Next Step: 

 -Implementing protocols like IPFS for images and create the minting process of NFTs for winners and for Donors. 

  **Seventh Commit:** 
  -Launch of the second Smart Contract Focused on the creation and distribution of NFTs, Using IPFS to host the pictures and metadata, each NFT will be personalized providing a social proof that the user contributed to the charity.

  -Improvements on the first Smart Contract, that includes, Usind a CID for the Banner of each new Lottus, this can be changed while the lottus is still live. in case there's an update.

    -Included the function to send the Winner NFT automatically and another one to let the donors mint, theirs this function requires the lottus to have ended and also requires that the users have donated to the actual lottus.


 ## Next Step: 

 -Connecting the changes to the Front End, and start implementing Filebase as a backup for the files and registries of each lottus. 

   **Eighth Commit:** 
  -Basic changes on both smart contracts. creation of badges and level functions. 
  -Connections to the front end. 


   **Nineth Commit:** 
  -Improvement on connecting the front end to the smart contract. 
  -Added a banner that works as an incentive for people to participate.
  -Added a roadmap to share the plans of the project.
  -Changed some components to improve style. 

  
   ![Lottus With info](https://firebasestorage.googleapis.com/v0/b/heartventure-18dee.appspot.com/o/Lottus%2Ffsfsf.png?alt=media&token=bd0f9345-0233-488b-b8f2-66ff744d3f70)

      **Tenth Commit:** 
  -Added Huddle01 Iframe for the postlottus event where people will be able to talk with the charity. 
  

  
   ![Lottus With info](https://firebasestorage.googleapis.com/v0/b/heartventure-18dee.appspot.com/o/Lottus%2Fggfggf.png?alt=media&token=69accc4e-fe9b-484b-bcd5-d5cac3ffb159)

