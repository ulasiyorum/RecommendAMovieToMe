import './Question.css';
import { imagePath } from '../lib/private';
import { useState, useEffect } from 'react';

function QuestionCard(props) {

    return (
    <div className='questionCard'>
        <img src={props.src} onClick={props.onClick}/>
        <h1>{props.title == undefined ? props.name : props.title}</h1>
        <div className='qc-stars'>
            <h5>Rating: </h5>
            <h5>{props.stars}</h5>
        </div>
    </div>
    
    );


}





export default function Question(props) {

    function getThreeMovies() {
        
        let tm = [];
        let random = Math.floor(Math.random() * 20);
        for(let i = 0; i < 3; i++) {
            while(tm.includes(movies[random]) || picked.includes(movies[random]))
            {
                random = Math.floor(Math.random() * movies.length);
            }
            tm.push(movies[random]);
        }
        return tm;



    }

    const [movies,setMovies] = useState(props.movies);
    const [reload, setReload] = useState(true);

    const [picked, setPicked] = useState([]);
    let tm = getThreeMovies();

    const pickOne = (e, item) => {
        
        picked.push(item);
        setReload(!reload);
    }

    return (

        <div className='question'>
            <h1>Pick Your Favorite!</h1>
            <div>
                {tm.map((value) => {
                        return (
                            <QuestionCard src={imagePath + value.poster_path}
                            title={value.title}
                            name={value.name}  
                            key={value.id}
                            onClick={(event) => pickOne(event,value)}  
                            stars="3.5"/>
                        );
                    
                    })
                }
            </div>
        </div>


    );
}