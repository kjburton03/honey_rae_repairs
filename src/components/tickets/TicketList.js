//////////stuff to find in here //////////////
// ticketList 
// warning: each child in a list should have a unique "key" prop
//////////////////////////////////////////////
// first page of project
// step 1 imports from react , export TicketList with const[] = useState, useEffect to show the state , & html return


import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Ticket } from "./Ticket"
                    //  useState is function to store the state in a component. The function returns an array. The array contains the intial state value at index 0 and a function that modifies the state at index 1.
                    //  useEffect is function to observe state.  and run some instructions when state changes.
import "./Tickets.css"
                    // css for just the ticket list classNames tickets and ticket



export const TicketList = ({ searchTermState }) => {  // theres the searchTermState key , its value is the actual state from the parent, the search terms themselves -not a direct state variable - neeeds a use effect
    const [tickets, setTickets] = useState([])
                    //  initial state value at index 0 & function that modifies the state at index 1 via a 
                    // tickets has a value of an empty array.
                    //   setTickets has a value of a function. function to change state 
    const [filteredTickets, setFiltered] = useState([])
                    // not modifyind the array of tickets, of displaying certain tickets 
                    // use useEffect to decide what is shown
    const [employees, setEmployees] = useState([])

    const [emergency, setEmergency] = useState(false)
                    //  tracking whether or not we need emergency to be listed via another state variable
                    // dont want to show emergency only tickets first so state is set to false -> needs toggle in button via onClick
    const [openOnly, updateOpenOnly] = useState(false)
                    // shows only tickets that have yet to be completed by staff in the customer view 
    

    
    const navigate = useNavigate() //navigate to new tickets form etc.  //// forgot the () at first... long search 




    const localHoneyUser = localStorage.getItem("honey_user")
                    //  grabs honey_user out of storage
                    // ^string, needs to be converted into an objext
    const honeyUserObject = JSON.parse(localHoneyUser) 
                    // devtools -> application -> storage -> localhost -> now shows the value of staff and id under it 

    useEffect(      // to observe state from parent  & filter down to what is typed into search tab
        () => {                         //filter original tickets
            const searchedTickets = tickets.filter(ticket => {
                return ticket.description.toLowerCase().startsWith(searchTermState.toLowerCase())
            
            }) //for each ticket, lets return => ticket.description starts with the searchTermState we got from the parent, a
            setFiltered(searchedTickets) //updating filtered tickets
        },
        [ searchTermState ]
    )
    // devTools components -> ticketList -> props -> searchTermState: ""     <-shows in parentheses what you are currently typing
    // if you console.log(searchTermState) in the use effect it will show everything typed into the search in the console log
    
    useEffect(
        () => {
            if (emergency) { // only if its an emergency
               const emergencyTickets = tickets.filter(ticket => ticket.emergency === true) //* uses original ticket & returns every ticket to an array
               setFiltered(emergencyTickets) //displaying filtered tickets so you need to update its state to emergencyTickets
            }// array saved in emergencyTickets 
            else {
                setFiltered(tickets) //filters back to all tickets when show all button is pressed. 
            }

        },
        [emergency] //observing emergent tickets
    )

        // lets us get all tickets on initial state and invoked when the button is clicked for claimed tickets
        const getAllTickets = () => {
            fetch(`http://localhost:8088/serviceTickets?_embed=employeeTickets`) ///grabs every ticket made by customers . dont need a return statement before fetch    added the ?_embed=employeeTickets to show who is working on a ticket or if it has yet to be claimed
            .then(response => response.json()) /// get the response, parse the response, turn it back into an array 
            .then((ticketArray) => {
                setTickets(ticketArray)
                
            }) 
        }



    useEffect(
        () => {
            getAllTickets()
            fetch(`http://localhost:8088/serviceTickets?_embed=employeeTickets`) ///grabs every ticket made by customers . dont need a return statement before fetch    added the ?_embed=employeeTickets to show who is working on a ticket or if it has yet to be claimed
                .then(response => response.json()) /// get the response, parse the response, turn it back into an array 
                .then((ticketArray) => {
                    setTickets(ticketArray)
                    
                }) /// ticketArray is a parameter to capture all the data processed from servicetickets database
                    /// database.json //-> serviceTickets -> tickets -> //setTickets-useSTate-useEffect-fetch// ticketArray
                    ///serviceTickets -> tickets -> ticketArray new value
                    fetch(`http://localhost:8088/employees?_expand=user`) ///grabs every ticket made by customers . dont need a return statement before fetch    added the ?_embed=employeeTickets to show who is working on a ticket or if it has yet to be claimed
                    .then(response => response.json()) /// get the response, parse the response, turn it back into an array 
                    .then((employeeArray) => {
                        setEmployees(employeeArray)
                        
                    }) 
        },
        []          // When this array is empty, you are observing initial component state
    )







                    //when ticket state changes use a useEffect to decide whether to show the user all tickets or only their tickets
        useEffect(
            () => {
                if(honeyUserObject.staff) {
                    // employees
                    setFiltered(tickets)
                    //shows all tickets through setFiltered state ... i think 
                }
                else {
                    // customers
                    const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                    
                    // filters throught all tickets then shows only the tickets that customerID's matches user's id
                    setFiltered(myTickets)
                    // uses the new myTickets array to see them updated.. last step in the return
                }
            },
            [tickets]
        )
                     // the tickets do not change until useEffect [tickets] is applied. <--- state variables
                     /////// useEffect is to observe state  

    useEffect(  // show only completed tickets
        () => {  //function -> if openOnly 
            if (openOnly) { 
                const openTicketArray =  tickets.filter(ticket => {
                    return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""   // if the tickets user id matches with the json id    if you change it to !== the opposite will happen
                                                                                                 // anddd the tickets date completed is not an empty string
            })
            setFiltered(openTicketArray)  // shows opened tickets 
            }
            else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id) //back to all tickets 
                
                setFiltered(myTickets) //brings it back 


            }
        },
        [ openOnly ] //observing openOnly array 

    )




// parent container includes




    return <> 

        {
            honeyUserObject.staff 
            ? <>
                 <button onClick={ () => { setEmergency(true) }} >Emergency Only</button>
                 <button onClick={ () => { setEmergency(false) }} >Show All</button>
            </>
            : <>
                <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
                <button onClick={() => updateOpenOnly(true)}>Open Ticket</button>
                <button onClick={() => updateOpenOnly(false)}>All Tickets</button>

            </>
        }
    <h2>List of Tickets</h2>

        <article className="tickets">
            {
                filteredTickets.map(
                    (ticket) => <Ticket employees={employees} 
                        getAllTickets={getAllTickets} //same prop name as function reference
                        currentUser={honeyUserObject} 
                        ticketObject={ticket} />
                )
            }
        </article>

    </>
}


///////each child in a list should have a unique key warning///////////////
//// add key property to <section> key={`ticket--${ticket.id}`} ///////////


//////////// <button>
                               //onClick toggles setEmergency from false, to true when button is clicked 
                               // *3000/ticket* devTools -> components -> ticketList -> hooks -> state -> switches from false to true
                                   //  <button
                                   //   onClick={
                                   //       () => {
                                   //           setEmergency(true)
                                   //       }
                                   //   }
                                   //   >Emergency Only</button>

                               // if there is more then one button they must be grouped  
                               // parent react fragment for both buttons 
                               //     { honeyUserObject.staff ?<>    ***button1***button2*** </> :***customer button***       }    
                               
                               
                               // customer button navigates to new screen
                               // updateOpenOnly(true) lets you view only the tickets that have yet to be taken care of

/////////// .map
                                //basic jsx(syntax to create elements) for displaying the state ^
                                // using interpolation in react no need for $  
                                // iterating the entire array of objects through map array method 
                                // map array method converts items into arrays - conversion tool to html representation
                                // call back function with ticket in the ()
                                // for each (ticket) => { return this html representation of a ticket}
                                // without return key you will see nothing 
                                // ternary statement -> emergency true or false -> condensed if/else statement


/////////////////////////////////////////////////////////////////////////////////////
// to see tickets via dev tools components -> TicketList -> hooks -> state //////////
/////////////////////////////////////////////////////////////////////////////////////


//////tickets

                                //  export const ticket list is sent to application views which includes

                                // console.log("Initial state of tickets", tickets) // View the initial state of tickets
                                // when inside use effect ^


//// this is the initial state ///