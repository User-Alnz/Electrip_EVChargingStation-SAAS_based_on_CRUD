import { useState } from "react";
import "./Paginaton.css";

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

const ReduceArray = (resultArray : number[], currentPage : number) : number[] => 
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


function handleListingLogic(resultLength : number, currentPage : number, setCurrentPage : React.Dispatch<React.SetStateAction<currentPage>>) : JSX.Element
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
                        className={`.unstyled-button ${
                        currentPage === 1 ? "bg-blue-500 text-white" : "bg-white"
                        }`}>
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
        <div>
            <button>Perv</button>
                <ul className="">
                    {handleListingLogic(resultLength, currentPage, setCurrentPage)}
                </ul>
            <button>Next</button>
        </div>
    );
}

export default Pagination;