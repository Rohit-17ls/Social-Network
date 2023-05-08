import React, {useRef, useState} from 'react'
import SmartText from './SmartText';

const Search = () => {

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const inputRef = useRef();

    const adoptSearchResult = (value) => {
        setSearch(value);
        inputRef.current.value = value;
    }

    const searchHandler = async(target) => {
        if(target.value.length && (target.value[0] === '@' || target.value[0] === '&')){
            target.style.color = target.value[0] === '@' ?  '#02F798' : '#e76306';
            if(target.value.length > 1){

                const res = await fetch(`http://localhost:3000/api/search/${target.value}`, {
                    method : 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
                const data = await res.json();
                console.log(data);
                if(!data.resultsFound){
                    setNoResults(true);
                }else{
                    if(noResults) setNoResults(false);
                    setSearchResults(data.results);
                } 
            }

        }else{
            target.style.color = 'white';
            setSearchResults([]);
        }
        setSearch(target.value);
    }

    return (
        <div className='w-1/3 max-w-[500px] m-3'>
            {/* <Input type={"text"} defaultValue={"Search for names with an @ and groups with &"} title="" handler={searchHandler}/> */}
            <input
                ref={inputRef}
                type="text"
                spellCheck="false"
                placeholder={"Search for names with an @ and groups with &"}
                name={"search"}
                className = 'font-semibold  px-3 py-1 h-fit rounded-2xl border-solid border-2 border-themecolor w-full'
                onChange={(e) => {searchHandler(e.target)}}
            />
            <div className='m-auto flex flex-col w-full bg-bglight rounded-t-xl rounded-b-lg'>
                {searchResults.map((result, id) => 
                    <div key={id} className='w-full px-3 py-1 text-left hover:bg-[#383737]' onClick={() => {adoptSearchResult(result.search_result)}}>
                        <SmartText text={result.search_result}/>
                    </div>)
                }
            </div>
        </div>
    )
}

export default Search