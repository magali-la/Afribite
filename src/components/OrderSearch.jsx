import { CiSearch } from "react-icons/ci";

const OrderSearch = ({setSearchTerm, handleSearch}) => {
    return(
        <div className="flex flex-row items-center bg-inherit border border-[#E2725B]/20 focus:outline-none focus:border-[#E2725B] rounded-3xl">
          <CiSearch className='text-2xl text-n-n3 w-1/4'/>
          <input type="text" className="w-3/4 bg-inherit border-none" placeholder='Search for Orders' 
          onKeyDown={e => {if (e.key == "Enter" && e.target.value !== ''){
              console.log('enter pressed');

              let searchValue = e.target.value;

              // update the state of searchterm with the input value
              setSearchTerm(searchValue);

              // trigger the search function
              handleSearch(searchValue);
            }}
          } 
          />
            
        </div>
    );
};

export default OrderSearch;