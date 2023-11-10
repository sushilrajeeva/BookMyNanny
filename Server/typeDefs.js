//Create the type definitions for the query and our data

export const typeDefs = `#graphql
  type Parent {
    _id: String!
    firstName: String!
    middleName: String
    lastName: String!
    emailAddress: String!
    countryCode: String!
    phoneNumber: Int!
    street: String!
    city: String!
    state: String!
    country: String!
    pincode: String!
    dob: String!
    role: String!
    password: String!
    subscribedListings: [SubscribedListing]
    wallet: Int!
    reviews: [Review]
  }
  
  type Admin {
    _id: String!
    name: String!
    emailAddress: String!
    countryCode: String!
    phoneNumber: Int!
    password: String!
    unverifiedNannyList: [UnverifiedNanny]
  }
  
  type Nanny {
    _id: String!
    firstName: String!
    middleName: String
    lastName: String!
    emailAddress: String!
    countryCode: String!
    phoneNumber: Int!
    street: String!
    city: String!
    state: String!
    country: String!
    pincode: String!
    dob: String!
    role: String!
    password: String!
    Listings: [Listing]
    wallet: Int!
  }
  
  type SubscribedListing {
    listingID: String!
    active: Boolean!
  }
  
  type Review {
    reviewID: String!
  }
  
  type UnverifiedNanny {
    nannyID: String!
  }
  
  type Listing {
    _id: String!
    nannyID: String!
    listingName: String!
    emailAddress: String!
    street: String!
    city: String!
    state: String!
    country: String!
    pincode: String!
    hourlyRate: Int!
    startTime: String!
    endTime: String!
    availableDate: String!
    postedDate: String!
    interestedParents: [InterestedParent]
    selectedParentID: String
    progressBar: Int!
    messageID: String!
  }
  
  type InterestedParent {
    parentID: String!
  }
  
  type Message {
    _id: String!
    listingID: String!
    messages: [IndividualMessage]
  }
  
  type IndividualMessage {
    parentID: String!
    nannyID: String!
    messagerID: String!
    message: String!
    timestamp: String!
  }
  
  type Query {
    #add needed queries
  }
  type Mutation {
    #add needed mutations
    
  }
`;
