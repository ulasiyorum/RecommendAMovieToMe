import './Question.css';
import { imagePath } from '../lib/private';

function QuestionCard(props) {

    return (
    <div className='questionCard'>
        <img src={props.src}/>
        <h1>{props.title}</h1>
        <div className='qc-stars'>
            <h5>Rating: </h5>
            <h5>{props.stars}</h5>
        </div>
    </div>
    
    );


}

export default function Question(props) {

    const tm = [props.movies.pop(), props.movies.pop(), props.movies.pop()];

    console.log(tm);

    return (

        <div className='question'>
            <h1>Pick Your Favorite!</h1>
            <div>
                {tm.map((value) => {

                        return (
                            <QuestionCard src={imagePath + value.poster_path}
                            title={value.title}  
                            key={value.id}  
                            stars="3.5"/>
                        );
                    
                    })
                }
            </div>
        </div>


    );
}