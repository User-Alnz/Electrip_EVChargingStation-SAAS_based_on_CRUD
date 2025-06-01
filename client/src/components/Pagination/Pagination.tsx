import { useState } from "react";
import "./Paginaton.css";

type Option = "increment" | "decrement";

const controlPaginationFlow = ( resultLength : number, currentPage : number, setCurrentPage : React.Dispatch<React.SetStateAction<currentPage>>, paginationOption : Option ) : void => 
{
    if(paginationOption === "increment")
    {
        if(currentPage < resultLength)
        setCurrentPage(currentPage+1);
    }

    if(paginationOption === "decrement")
    {
        if(currentPage > 1)
        setCurrentPage(currentPage-1);
    }
}

const generatePagination = ( resultLength : number ) : number[] => 
{
    let array = [];
    let index = 0;
    
    while(index< resultLength)
    {
        array.push(index+1);
        index++;
    }

    return array;
}

const ReduceArray = ( resultArray : number[], currentPage : number) : number[] => 
{   
    let startFrom = currentPage-3;
    let stopFrom = currentPage +2;

    if(currentPage === 1)
    startFrom = currentPage-1;
    
    if(currentPage === 2)
    startFrom = currentPage-2;
    
    const slicedArray = resultArray.slice(startFrom, stopFrom);

    return slicedArray;
}


function handleListingLogic( resultLength : number, currentPage : number, setCurrentPage : React.Dispatch<React.SetStateAction<currentPage>>) : JSX.Element
{
    
    const resultArray = generatePagination(resultLength);
    const newResultArray = ReduceArray(resultArray, currentPage);

    return(
    <>
        {newResultArray.map((item, index) => {

            const pageNumber = index+1;

            return(
                <li key ={pageNumber} >

                    <button 
                        onClick={() => setCurrentPage(item)}
                        className={`unstyled-button ${currentPage === item ? "active-page" : ""}`}>
                        {item}
                    </button>
                
                </li>
            );
        })}
    </>
    );

}

type currentPage = number;

function Pagination()
{
    const [ currentPage, setCurrentPage ] = useState<currentPage>(1);
    const resultLength = 10;
    
    return(

        <div className="PaginationContainer">

            <button className="PaginationMouvebutton" 
                onClick={() => controlPaginationFlow(resultLength, currentPage, setCurrentPage, "decrement")}>
                Prev
            </button>

                <ul className="wrapPaginationResult">
                    {handleListingLogic(resultLength, currentPage, setCurrentPage)}
                </ul>

            <button className="PaginationMouvebutton" 
                onClick={() => controlPaginationFlow(resultLength, currentPage, setCurrentPage, "increment")}>
                Next
            </button>

        </div>
    );
}

export default Pagination;