import React from 'react';
//This funcition is meant to rerender a parent from its react state each Time its Value/State is updated from setState use by its children component. 
class GenRerender <T extends boolean | number> 
{
    
    //We use <T> which is argument type taken as parameter of Class 
    private setState : React.Dispatch<React.SetStateAction<T>>; 

    constructor(setState :React.Dispatch<React.SetStateAction<T>>)
    {
        this.setState = setState;
    }

    //Based on React operation component are rerendered if state change meaning we'll rerender parent if state is changed by children
    public TriggerRerender():void
    {

        this.setState(input => { //catch state through callback function and setState through callback. we change it based on initial state form useState itslef.

            if (typeof input === 'number')
            return input + 1 as T;
            
            if (typeof input === 'boolean' && input === false)
            return true as T;
    
            if (typeof input === 'boolean' && input === true)
            return false as T;
            
            return input as T;
        })

    }

}

export {GenRerender};